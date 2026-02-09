declare global {
  interface Window {
    Superchat?: {
      init: (options: {
        applicationKey: string;
        hideWidget?: boolean;
        language?: string;
        welcomeMessage?: string;
      }) => void;
      open: (options?: { channelId?: string; groupId?: string; message?: string }) => void;
      show: () => void;
      hide: () => void;
      showWelcomeMessage: (message: string) => void;
    };
  }
}

export {};
