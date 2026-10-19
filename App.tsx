import React, { useState } from 'react';
import { Flashcard } from './types';
import { INITIAL_CARDS, generateFlashcardsWithGemini } from './services/geminiService';
import { FlashcardItem } from './components/FlashcardItem';

export const App: React.FC = () => {
  const [cards, setCards] = useState<Flashcard[]>(INITIAL_CARDS);
  const [topic, setTopic] = useState<string>('Large Language Models');
  const [customTopicInput, setCustomTopicInput] = useState<string>('');
  
  // LOGIC: Only ONE flashcard can be turned over at a time
  const [turnedOverCardId, setTurnedOverCardId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newAnswer, setNewAnswer] = useState<string>('');
  const [newDifficulty, setNewDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');

  const popularTopics = [
    'Large Language Models',
    'Machine Learning',
    'Cloud Computing',
    'Generative AI',
    'Neural Networks'
  ];

  // Turn over toggle logic: only one card turned over at a time
  const handleToggleTurnOver = (cardId: string) => {
    setTurnedOverCardId(prev => (prev === cardId ? null : cardId));
  };

  // Turn all cards face down
  const handleResetTurnOver = () => {
    setTurnedOverCardId(null);
  };

  // Generate flashcards for a topic
  const handleGenerateTopic = async (newTopic: string) => {
    if (!newTopic.trim()) return;
    setIsLoading(true);
    setStatusMessage(`Generating flashcards for "${newTopic}"...`);
    setTurnedOverCardId(null); // Reset turned over state on new topic

    try {
      const generated = await generateFlashcardsWithGemini(newTopic.trim(), 6, []);
      setCards(generated);
      setTopic(newTopic.trim());
      setStatusMessage(`Loaded ${generated.length} flashcards for "${newTopic.trim()}".`);
    } catch (err) {
      console.error(err);
      setStatusMessage(`Failed to generate flashcards.`);
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  // "add 5 more" button handler - strictly ensures NO DUPLICATES
  const handleAddFiveMore = async () => {
    setIsLoading(true);
    setStatusMessage(`Generating 5 more unique flashcards for "${topic}"...`);
    
    try {
      const existingQuestions = cards.map(c => c.question);
      const additionalCards = await generateFlashcardsWithGemini(topic, 5, existingQuestions);
      
      // Secondary client-side deduplication safeguard
      const uniqueAdditional = additionalCards.filter(newCard => {
        const normNew = newCard.question.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        return !cards.some(c => c.question.trim().toLowerCase().replace(/[^a-z0-9]/g, '') === normNew);
      });

      if (uniqueAdditional.length > 0) {
        setCards(prev => [...prev, ...uniqueAdditional]);
        setStatusMessage(`Successfully added ${uniqueAdditional.length} new unique flashcards (no duplicates). Total: ${cards.length + uniqueAdditional.length}`);
      } else {
        setStatusMessage(`All unique concepts for "${topic}" are already in your deck.`);
      }
    } catch (err) {
      console.error("Failed to add 5 more cards:", err);
      setStatusMessage("Failed to generate additional flashcards.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  // Shuffle cards
  const handleShuffle = () => {
    setTurnedOverCardId(null);
    setCards(prev => [...prev].sort(() => Math.random() - 0.5));
    setStatusMessage('Shuffled flashcards!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Add custom user card with duplicate check
  const handleAddCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQ = newQuestion.trim();
    const trimmedA = newAnswer.trim();
    if (!trimmedQ || !trimmedA) return;

    // Check duplicate
    const isDup = cards.some(c => c.question.trim().toLowerCase() === trimmedQ.toLowerCase());
    if (isDup) {
      alert("A flashcard with this question already exists!");
      return;
    }

    const newCard: Flashcard = {
      id: `custom-${Date.now()}`,
      question: trimmedQ,
      answer: trimmedA,
      topic,
      difficulty: newDifficulty,
      category: 'Custom'
    };

    setCards(prev => [newCard, ...prev]);
    setNewQuestion('');
    setNewAnswer('');
    setShowAddModal(false);
    setStatusMessage('Added new custom flashcard!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const currentlyTurnedCardIndex = turnedOverCardId 
    ? cards.findIndex(c => c.id === turnedOverCardId)
    : -1;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <span className="material-symbols-outlined text-2xl">style</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Flashcard Maker
                <span className="text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Light Green Theme
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Interactive AI-Powered Learning Cards
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* The "add 5 more" button */}
            <button
              id="add-5-more-header"
              data-testid="add-5-more"
              aria-label="add 5 more"
              onClick={handleAddFiveMore}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
              title="Add 5 more unique flashcards without duplicates"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>add 5 more</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Create a custom flashcard"
            >
              <span className="material-symbols-outlined text-lg">edit_note</span>
              <span className="hidden sm:inline">New Card</span>
            </button>

            <button
              onClick={handleShuffle}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
              title="Shuffle cards"
              aria-label="Shuffle cards"
            >
              <span className="material-symbols-outlined text-xl">shuffle</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
        
        {/* Rule & Status Banner */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300">
              <span className="material-symbols-outlined text-xl">lock_clock</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-emerald-300 uppercase tracking-wide">
                  Single Turnover Rule Active
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-xs text-emerald-200/80">
                Only one flashcard can be turned over at a time. Turning over any card automatically turns back the previous card.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="text-xs px-3 py-1.5 rounded-lg bg-slate-900/80 border border-emerald-500/20 text-emerald-300">
              {currentlyTurnedCardIndex >= 0 ? (
                <span>Currently Turned Over: <strong>Card #{currentlyTurnedCardIndex + 1}</strong></span>
              ) : (
                <span className="text-slate-400">All cards face down</span>
              )}
            </div>

            {turnedOverCardId && (
              <button
                onClick={handleResetTurnOver}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Turn All Face Down
              </button>
            )}
          </div>
        </div>

        {/* Topic Search & Controls Section */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Current Topic
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>{topic}</span>
                <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-medium">
                  {cards.length} unique cards
                </span>
              </h2>
            </div>

            {/* Topic Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerateTopic(customTopicInput);
                setCustomTopicInput('');
              }}
              className="flex items-center gap-2 max-w-md w-full"
            >
              <div className="relative flex-1">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  type="text"
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="Enter any topic to generate..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !customTopicInput.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer flex-shrink-0"
              >
                Generate
              </button>
            </form>
          </div>

          {/* Preset Topics */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/60">
            <span className="text-xs text-slate-400 font-medium mr-1">Presets:</span>
            {popularTopics.map((t) => (
              <button
                key={t}
                onClick={() => handleGenerateTopic(t)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  topic.toLowerCase() === t.toLowerCase()
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                    : 'bg-slate-900/60 text-slate-300 border-slate-700 hover:bg-slate-700/60 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Status / Loading Notification */}
        {statusMessage && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-sm text-emerald-300 flex items-center gap-2 animate-fadeIn">
            {isLoading && <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>}
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Flashcards Grid with Light Green Background */}
        <section aria-label="Flashcards Collection">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Flashcards
              </h3>
              <span className="text-xs text-slate-500">
                (Click any card to turn it over)
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Secondary 'add 5 more' button directly above the grid */}
              <button
                id="add-5-more-grid"
                data-testid="add-5-more-grid"
                aria-label="add 5 more"
                onClick={handleAddFiveMore}
                disabled={isLoading}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>add 5 more</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-3 h-3 rounded bg-[#dcfce7] border border-emerald-400 inline-block" />
                <span className="hidden sm:inline">Light green cards</span>
              </div>
            </div>
          </div>

          {cards.length === 0 ? (
            <div className="text-center py-16 bg-slate-800/40 rounded-2xl border border-slate-700">
              <span className="material-symbols-outlined text-5xl text-slate-600 mb-2">style</span>
              <p className="text-slate-400 text-sm">No flashcards found. Click below to add cards.</p>
              <button
                onClick={() => handleGenerateTopic(topic)}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Generate Default Cards
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <FlashcardItem
                  key={card.id}
                  card={card}
                  index={index}
                  // LOGIC: Only one flashcard can be turned over at a time
                  isTurnedOver={turnedOverCardId === card.id}
                  onToggleTurnOver={() => handleToggleTurnOver(card.id)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Bottom Action Footer */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div className="text-xs text-slate-400">
            Total Cards: <span className="font-semibold text-white">{cards.length} unique</span> • Background: <span className="text-emerald-400 font-semibold">Light Green (#dcfce7)</span> • Single Turnover: <span className="text-emerald-400 font-semibold">Enforced</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="add-5-more-footer"
              data-testid="add-5-more-footer"
              aria-label="add 5 more"
              onClick={handleAddFiveMore}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>add 5 more</span>
            </button>
          </div>
        </div>

      </main>

      {/* Add Custom Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-400">add_box</span>
                Add New Flashcard
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCustomCard} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Question / Term (Front of card)
                </label>
                <textarea
                  rows={2}
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g., What is Self-Attention?"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Answer / Definition (Back of card)
                </label>
                <textarea
                  rows={3}
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="e.g., A mechanism allowing the model to weight the importance of different tokens relative to each other."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value as any)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                  >
                    Create Card
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;