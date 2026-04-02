export const textToSpeechService = {
  isAvailable() {
    return 'speechSynthesis' in window;
  },

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.isAvailable()) {
        reject('Text to speech not supported');
        return;
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Options
      utterance.lang = options.lang || 'fr-FR';
      utterance.pitch = options.pitch || 1;
      utterance.rate = options.rate || 1;
      utterance.volume = options.volume || 1;

      // Callbacks
      utterance.onstart = () => {
        if (options.onStart) options.onStart();
      };

      utterance.onend = () => {
        if (options.onEnd) options.onEnd();
        resolve();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error', event);
        reject(event);
      };

      // Ensure voices are loaded
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a good French voice
        const frenchVoice = voices.find(v => v.lang.includes('fr') && v.name.includes('Google')) || 
                           voices.find(v => v.lang.includes('fr'));
        if (frenchVoice) utterance.voice = frenchVoice;
        window.speechSynthesis.speak(utterance);
      } else {
        // Wait for voices to load (Chrome specific quirk)
        window.speechSynthesis.onvoiceschanged = () => {
          const loadedVoices = window.speechSynthesis.getVoices();
          const frenchVoice = loadedVoices.find(v => v.lang.includes('fr'));
          if (frenchVoice) utterance.voice = frenchVoice;
          window.speechSynthesis.speak(utterance);
        };
      }
    });
  },

  stop() {
    if (this.isAvailable()) {
      window.speechSynthesis.cancel();
    }
  },

  pause() {
    if (this.isAvailable()) {
      window.speechSynthesis.pause();
    }
  },

  resume() {
    if (this.isAvailable()) {
      window.speechSynthesis.resume();
    }
  }
};