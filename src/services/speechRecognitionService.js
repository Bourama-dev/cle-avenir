export const speechRecognitionService = {
  recognition: null,
  isListening: false,
  transcript: '',
  onResultCallback: null,
  onErrorCallback: null,
  onEndCallback: null,

  isAvailable() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  },

  initialize() {
    if (!this.isAvailable()) return false;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRecognition();
    
    // Configuration
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'fr-FR';

    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (this.onResultCallback) {
        this.onResultCallback({ final: finalTranscript, interim: interimTranscript });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      this.isListening = false;
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        // If supposed to be listening but stopped (e.g. silence), restart
        try {
          this.recognition.start();
        } catch (e) {
          this.isListening = false;
        }
      } else {
        if (this.onEndCallback) this.onEndCallback();
      }
    };

    return true;
  },

  startListening(onResult, onError, onEnd) {
    if (!this.recognition) {
      const success = this.initialize();
      if (!success) {
        if (onError) onError('Speech recognition not supported');
        return;
      }
    }

    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.onEndCallback = onEnd;
    this.isListening = true;

    try {
      this.recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      // Sometimes it's already started
    }
  },

  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn("Could not stop recognition:", e);
      }
    }
  },

  reset() {
    this.stopListening();
    this.recognition = null;
  }
};