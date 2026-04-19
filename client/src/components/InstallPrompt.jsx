import { useEffect, useState } from 'react';

const DISMISS_KEY = 'cc-install-dismissed-at';
const DISMISS_WINDOW_MS = 1000 * 60 * 60 * 24 * 7;

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function detectPlatform() {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  if (isIOS) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'other';
}

export default function InstallPrompt() {
  const [platform, setPlatform] = useState('other');
  const [deferredEvent, setDeferredEvent] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_WINDOW_MS) return;

    const p = detectPlatform();
    setPlatform(p);

    const handler = (e) => {
      e.preventDefault();
      setDeferredEvent(e);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    if (p === 'ios') setVisible(true);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const install = async () => {
    if (!deferredEvent) return;
    deferredEvent.prompt();
    const choice = await deferredEvent.userChoice;
    if (choice.outcome === 'accepted' || choice.outcome === 'dismissed') {
      setDeferredEvent(null);
      setVisible(false);
    }
  };

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 rounded-2xl bg-brand-brown text-brand-cream shadow-2xl p-4 sm:mx-auto sm:max-w-md">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-cream/15 text-xl">
          ☕
        </div>
        <div className="flex-1 text-sm">
          <p className="font-semibold">Add to Home Screen</p>
          {platform === 'ios' ? (
            <p className="mt-1 opacity-90">
              Tap <span className="font-semibold">Share</span> <span aria-hidden>⎋</span> then{' '}
              <span className="font-semibold">Add to Home Screen</span> to save your stamp card.
            </p>
          ) : platform === 'android' && deferredEvent ? (
            <p className="mt-1 opacity-90">
              Install the Coffee Christopher app for one-tap access to your rewards.
            </p>
          ) : (
            <p className="mt-1 opacity-90">
              Install Coffee Christopher for quick access to your stamp card.
            </p>
          )}
          <div className="mt-3 flex gap-2">
            {deferredEvent && (
              <button
                onClick={install}
                className="rounded-lg bg-brand-cream text-brand-brown px-3 py-1.5 text-sm font-semibold"
              >
                Install
              </button>
            )}
            <button
              onClick={dismiss}
              className="rounded-lg border border-brand-cream/40 px-3 py-1.5 text-sm"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
