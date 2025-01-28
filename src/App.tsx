import React, { useState, useEffect } from 'react';
import { KeyRound, Unlock, Lock, History } from 'lucide-react';

interface StoredMessage {
  originalText: string;
  encryptedCode: string;
  timestamp: number;
}

function App() {
  const [inputText, setInputText] = useState('');
  const [decryptCode, setDecryptCode] = useState('');
  const [encryptedResult, setEncryptedResult] = useState('');
  const [decryptedText, setDecryptedText] = useState('');
  const [history, setHistory] = useState<StoredMessage[]>([]);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  useEffect(() => {
    const stored = localStorage.getItem('encryptedMessages');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const encrypt = (text: string): string => {
    let result = '';
    const chars = text.split('');
    
    // Simple encryption: take first character of each word or use character directly
    for (let i = 0; i < 4; i++) {
      const charCode = (chars[i]?.charCodeAt(0) || 65) % 26;
      result += String.fromCharCode(65 + charCode); // Convert to uppercase A-Z
    }

    return result.padEnd(4, 'A');
  };

  const decrypt = (code: string): string => {
    const stored = localStorage.getItem('encryptedMessages');
    if (!stored) return '';

    const messages: StoredMessage[] = JSON.parse(stored);
    const match = messages.find(msg => msg.encryptedCode === code);

    return match ? match.originalText : 'No matching message found';
  };

  const handleEncrypt = () => {
    if (!inputText.trim()) return;

    const encrypted = encrypt(inputText);
    setEncryptedResult(encrypted);

    const newMessage: StoredMessage = {
      originalText: inputText,
      encryptedCode: encrypted,
      timestamp: Date.now()
    };

    const stored = localStorage.getItem('encryptedMessages');
    const messages = stored ? JSON.parse(stored) : [];
    messages.push(newMessage);
    localStorage.setItem('encryptedMessages', JSON.stringify(messages));
    setHistory(messages);
    setInputText('');
  };

  const handleDecrypt = () => {
    if (decryptCode.length !== 4) return;
    const decrypted = decrypt(decryptCode.toUpperCase());
    setDecryptedText(decrypted);
  };

  const handleDecryptCodeChange = (value: string) => {
    const filtered = value.replace(/[^A-Za-z]/g, '').slice(0, 4);
    setDecryptCode(filtered.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <KeyRound className="h-8 w-8 text-indigo-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-800">Message Encryptor</h1>
          </div>

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setMode('encrypt')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                mode === 'encrypt'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Lock className="h-4 w-4" /> Encrypt
            </button>
            <button
              onClick={() => setMode('decrypt')}
              className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
                mode === 'decrypt'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Unlock className="h-4 w-4" /> Decrypt
            </button>
          </div>

          {mode === 'encrypt' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter Message
                </label>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Type your message..."
                />
              </div>
              <button
                onClick={handleEncrypt}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Encrypt Message
              </button>
              {encryptedResult && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Encrypted Code:</p>
                  <div className="bg-white p-3 rounded border border-gray-200 text-center font-mono text-2xl tracking-wider">
                    {encryptedResult}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter 4-Character Code
                </label>
                <input
                  type="text"
                  value={decryptCode}
                  onChange={(e) => handleDecryptCodeChange(e.target.value)}
                  className="w-full px-4 py-2 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-2xl tracking-wider font-mono"
                  maxLength={4}
                  placeholder="XXXX"
                />
              </div>
              <button
                onClick={handleDecrypt}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Decrypt Message
              </button>
              {decryptedText && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-2">Decrypted Message:</p>
                  <p className="font-mono bg-white p-3 rounded border border-gray-200">
                    {decryptedText}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-700">Recent Encryptions</h2>
            </div>
            <div className="space-y-2">
              {history.slice(-3).reverse().map((msg, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <div className="bg-white p-2 rounded border border-gray-200 text-center text-lg font-mono tracking-wider">
                    {msg.encryptedCode}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;