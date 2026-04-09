import { useState, useRef, useCallback } from 'react';

const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentUtteranceId, setCurrentUtteranceId] = useState(null);
  const utteranceRef = useRef(null);

  const stripMarkdown = (text) => {
    return text
      .replace(/#{1,6}\s?/g, '')       // headings
      .replace(/\*\*(.+?)\*\*/g, '$1') // bold
      .replace(/\*(.+?)\*/g, '$1')     // italic
      .replace(/__(.+?)__/g, '$1')     // bold alt
      .replace(/_(.+?)_/g, '$1')       // italic alt
      .replace(/~~(.+?)~~/g, '$1')     // strikethrough
      .replace(/`(.+?)`/g, '$1')       // inline code
      .replace(/```[\s\S]*?```/g, '')  // code blocks
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
      .replace(/!\[.*?\]\(.+?\)/g, '') // images
      .replace(/[-*+]\s/g, ', ')       // bullet points
      .replace(/\d+\.\s/g, ', ')       // numbered list
      .replace(/>\s?/g, '')            // blockquotes
      .replace(/---/g, '')             // horizontal rules
      .replace(/\n{2,}/g, '. ')        // multiple newlines
      .replace(/\n/g, '. ')            // newlines
      .replace(/\s+/g, ' ')           // extra spaces
      .trim();
  };

  const speak = useCallback((text, language = 'en', id = null) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech not supported');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const cleanText = stripMarkdown(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Set language
    if (language === 'hi') {
      utterance.lang = 'hi-IN';
    } else {
      utterance.lang = 'en-IN';
    }

    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const targetLang = language === 'hi' ? 'hi' : 'en';
    const matchingVoice = voices.find(v => v.lang.startsWith(targetLang));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentUtteranceId(id);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentUtteranceId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentUtteranceId(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setCurrentUtteranceId(null);
  }, []);

  return { isSpeaking, currentUtteranceId, speak, stop };
};

export default useTextToSpeech;
