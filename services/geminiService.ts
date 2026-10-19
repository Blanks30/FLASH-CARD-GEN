import { GoogleGenAI } from "@google/genai";
import { Flashcard } from '../types';

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const INITIAL_CARDS: Flashcard[] = [
  {
    id: 'card-1',
    question: 'What is a Large Language Model (LLM)?',
    answer: 'An AI model trained on vast amounts of text data using deep neural networks (Transformers) to understand, summarize, generate, and reason through human language.',
    topic: 'Large Language Models',
    difficulty: 'Easy',
    category: 'Fundamentals'
  },
  {
    id: 'card-2',
    question: 'What is the Transformer architecture and its core innovation?',
    answer: 'Introduced in the "Attention Is All You Need" paper (2017), the Transformer replaces recurrence with self-attention, processing sequences in parallel across entire contexts.',
    topic: 'Large Language Models',
    difficulty: 'Medium',
    category: 'Architecture'
  },
  {
    id: 'card-3',
    question: 'What role does Temperature play in generative models?',
    answer: 'Temperature scales logits prior to softmax. Lower values (e.g. 0.2) create focused, deterministic outputs, while higher values (e.g. 0.8) produce creative, diverse responses.',
    topic: 'Large Language Models',
    difficulty: 'Easy',
    category: 'Hyperparameters'
  },
  {
    id: 'card-4',
    question: 'What is Reinforcement Learning from Human Feedback (RLHF)?',
    answer: 'A post-training alignment method where human preferences train a reward model, which then guides policy optimization (e.g. via PPO) to make models helpful, honest, and harmless.',
    topic: 'Large Language Models',
    difficulty: 'Hard',
    category: 'Alignment'
  },
  {
    id: 'card-5',
    question: 'What is Retrieval-Augmented Generation (RAG)?',
    answer: 'A system architecture that retrieves relevant knowledge from external databases/documents and appends it to the prompt context, reducing hallucinations and grounding answers.',
    topic: 'Large Language Models',
    difficulty: 'Medium',
    category: 'Techniques'
  },
  {
    id: 'card-6',
    question: 'What is Hallucination in generative AI?',
    answer: 'When a model outputs syntactically fluent and confident statements that are factually false, ungrounded, or unsupported by real-world evidence.',
    topic: 'Large Language Models',
    difficulty: 'Easy',
    category: 'Limitations'
  }
];

// Rich, guaranteed unique pool for Large Language Models
const LLM_EXPANSION_POOL: Array<{ question: string; answer: string; difficulty: 'Easy' | 'Medium' | 'Hard'; category: string }> = [
  {
    question: 'What is Tokenization in natural language processing?',
    answer: 'The process of splitting raw text strings into discrete numerical tokens (using algorithms like Byte-Pair Encoding or WordPiece) that the neural network can process.',
    difficulty: 'Easy',
    category: 'Preprocessing'
  },
  {
    question: 'What is Low-Rank Adaptation (LoRA)?',
    answer: 'A parameter-efficient fine-tuning (PEFT) method that freezes pre-trained model weights and injects trainable rank decomposition matrices into Transformer layers, drastically cutting compute.',
    difficulty: 'Hard',
    category: 'Fine-Tuning'
  },
  {
    question: 'What is Chain of Thought (CoT) prompting?',
    answer: 'A prompting technique that encourages the model to generate intermediate reasoning steps before arriving at a final answer, significantly boosting multi-step problem solving.',
    difficulty: 'Medium',
    category: 'Prompt Engineering'
  },
  {
    question: 'What is Model Quantization (e.g., INT8, INT4)?',
    answer: 'Reducing the numerical precision of weights and activations (e.g. from 16-bit float to 4-bit integer) to reduce memory usage and accelerate inference latency with minimal accuracy loss.',
    difficulty: 'Medium',
    category: 'Optimization'
  },
  {
    question: 'What is a Context Window in LLMs?',
    answer: 'The maximum token limit (input tokens + output tokens) that a model can attend to and process in a single generation or inference pass.',
    difficulty: 'Easy',
    category: 'Architecture'
  },
  {
    question: 'What is Mixture of Experts (MoE)?',
    answer: 'An architecture where multiple specialized sub-networks ("experts") exist, and a routing gating network activates only a sparse subset of them per token, scaling capacity without scaling FLOPs.',
    difficulty: 'Hard',
    category: 'Architecture'
  },
  {
    question: 'What are Vector Embeddings?',
    answer: 'High-dimensional numerical array representations of text chunks where geometric proximity reflects semantic meaning and conceptual similarity.',
    difficulty: 'Easy',
    category: 'Representations'
  },
  {
    question: 'What is KV Caching during inference?',
    answer: 'Storing key and value tensors of previously computed tokens in memory so the model avoids re-evaluating attention for past tokens at each new autoregressive step.',
    difficulty: 'Hard',
    category: 'Inference'
  },
  {
    question: 'What is Direct Preference Optimization (DPO)?',
    answer: 'An alignment technique that optimizes model weights directly on human pairwise preference data without needing a separate reward model or complex reinforcement learning loops.',
    difficulty: 'Hard',
    category: 'Alignment'
  },
  {
    question: 'What is Speculative Decoding?',
    answer: 'An inference acceleration technique where a small, fast draft model generates candidate tokens in parallel, and a larger target model verifies them in a single forward pass.',
    difficulty: 'Hard',
    category: 'Inference'
  },
  {
    question: 'What is Perplexity in language modeling?',
    answer: 'An evaluation metric defined as the exponentiated average negative log-likelihood per token. Lower perplexity indicates the model predicts the test sample more accurately.',
    difficulty: 'Medium',
    category: 'Evaluation'
  },
  {
    question: 'What is Prompt Injection in LLM security?',
    answer: 'An adversarial vulnerability where user-supplied content subverts the developer system instructions and forces the model to follow unauthorized directives.',
    difficulty: 'Medium',
    category: 'Security'
  },
  {
    question: 'What is FlashAttention?',
    answer: 'An exact, memory-efficient attention algorithm that reorders softmax computation into GPU SRAM tiles, avoiding slow HBM memory read/writes and achieving significant speedups.',
    difficulty: 'Hard',
    category: 'Systems'
  },
  {
    question: 'What is the distinction between Zero-Shot and Few-Shot learning?',
    answer: 'Zero-shot asks the model to execute a task with only instructions; few-shot provides illustrative input-output demonstrations within the prompt context before the query.',
    difficulty: 'Easy',
    category: 'Prompt Engineering'
  },
  {
    question: 'What is Instruction Fine-Tuning (SFT)?',
    answer: 'Supervised training on curated instruction-response pairs to transition a base next-token predictor into an interactive assistant capable of following diverse user commands.',
    difficulty: 'Medium',
    category: 'Training'
  }
];

const ML_EXPANSION_POOL = [
  {
    question: 'What is Supervised Learning?',
    answer: 'A machine learning paradigm where the algorithm trains on labeled input-output pairs to learn a mapping function for unseen data.',
    difficulty: 'Easy' as const,
    category: 'Paradigms'
  },
  {
    question: 'What is the difference between Bias and Variance?',
    answer: 'Bias is error from overly simplistic assumptions (underfitting). Variance is sensitivity to minor fluctuations in training data (overfitting).',
    difficulty: 'Medium' as const,
    category: 'Evaluation'
  },
  {
    question: 'What is Gradient Descent?',
    answer: 'A first-order iterative optimization algorithm used to minimize a loss function by taking steps proportional to the negative gradient.',
    difficulty: 'Medium' as const,
    category: 'Optimization'
  },
  {
    question: 'What is Cross-Validation (K-Fold)?',
    answer: 'Partitioning a dataset into K equal subsets, training on K-1 subsets and validating on the remaining one iteratively to evaluate model generalizability.',
    difficulty: 'Easy' as const,
    category: 'Validation'
  },
  {
    question: 'What is L1 (Lasso) vs L2 (Ridge) Regularization?',
    answer: 'L1 adds the absolute value of coefficients, promoting sparsity (feature selection). L2 adds squared magnitude, penalizing large weights smoothly.',
    difficulty: 'Hard' as const,
    category: 'Regularization'
  },
  {
    question: 'What is the ROC-AUC score?',
    answer: 'Receiver Operating Characteristic Area Under Curve measures a binary classifier trade-off between True Positive Rate and False Positive Rate across all thresholds.',
    difficulty: 'Medium' as const,
    category: 'Metrics'
  },
  {
    question: 'What is Overfitting and how can it be mitigated?',
    answer: 'When a model memorizes noise instead of general patterns. Mitigate using regularization, dropout, cross-validation, data augmentation, or early stopping.',
    difficulty: 'Easy' as const,
    category: 'Fundamentals'
  },
  {
    question: 'What is a Confusion Matrix?',
    answer: 'A specific table layout displaying true positives, false positives, true negatives, and false negatives to evaluate classification performance.',
    difficulty: 'Easy' as const,
    category: 'Metrics'
  },
  {
    question: 'What is Unsupervised Learning?',
    answer: 'Learning algorithms that discover underlying patterns, clusters, or representations in unlabeled data (e.g. K-Means, PCA, Autoencoders).',
    difficulty: 'Easy' as const,
    category: 'Paradigms'
  },
  {
    question: 'What is the Vanishing Gradient problem?',
    answer: 'During backpropagation in deep networks, gradients shrink exponentially as they propagate backward, causing early layers to train extremely slowly.',
    difficulty: 'Hard' as const,
    category: 'Deep Learning'
  }
];

function normalizeQuestion(q: string): string {
  return q.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function isDuplicate(question: string, existingQuestions: string[]): boolean {
  const normTarget = normalizeQuestion(question);
  if (!normTarget) return false;
  return existingQuestions.some(existing => {
    const normExisting = normalizeQuestion(existing);
    return normExisting === normTarget || (normTarget.length > 10 && normExisting.includes(normTarget)) || (normExisting.length > 10 && normTarget.includes(normExisting));
  });
}

export async function generateFlashcardsWithGemini(
  topic: string,
  count: number = 5,
  existingQuestions: string[] = []
): Promise<Flashcard[]> {
  const results: Flashcard[] = [];
  const knownQuestions = [...existingQuestions];

  // Attempt Gemini API if key is present
  if (apiKey) {
    try {
      const avoidBlock = knownQuestions.length > 0
        ? `\nIMPORTANT: Do NOT duplicate or rephrase any of the following existing questions:\n${knownQuestions.slice(-15).map(q => `- ${q}`).join('\n')}\nEnsure all new questions explore different concepts, subtopics, or practical nuances.`
        : '';

      const prompt = `Generate ${count + 3} high-quality, educational flashcards for the topic: "${topic}".
Each card must feature an insightful Question and a clear, accurate Answer.${avoidBlock}
Return ONLY valid JSON matching this exact structure:
[
  {
    "question": "Clear question text?",
    "answer": "Accurate answer explanation.",
    "difficulty": "Easy" | "Medium" | "Hard",
    "category": "Sub-topic"
  }
]`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text?.trim() || '[]';
      const parsed = JSON.parse(text);

      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (results.length >= count) break;
          const q = item.question?.trim();
          const a = item.answer?.trim();
          if (q && a && !isDuplicate(q, knownQuestions)) {
            const newCard: Flashcard = {
              id: `gen-${Date.now()}-${results.length}-${Math.random().toString(36).substring(2, 6)}`,
              question: q,
              answer: a,
              topic,
              difficulty: item.difficulty || 'Medium',
              category: item.category || topic
            };
            results.push(newCard);
            knownQuestions.push(q);
          }
        }
      }
    } catch (err) {
      console.warn("Gemini generation call failed, falling back to curated pool:", err);
    }
  }

  // If we still need more unique cards to satisfy `count`, pull from expansion pools
  if (results.length < count) {
    const fallbackPool = topic.toLowerCase().includes('machine learning')
      ? ML_EXPANSION_POOL
      : LLM_EXPANSION_POOL;

    for (const item of fallbackPool) {
      if (results.length >= count) break;
      if (!isDuplicate(item.question, knownQuestions)) {
        results.push({
          id: `pool-${Date.now()}-${results.length}-${Math.random().toString(36).substring(2, 6)}`,
          question: item.question,
          answer: item.answer,
          topic,
          difficulty: item.difficulty,
          category: item.category
        });
        knownQuestions.push(item.question);
      }
    }
  }

  // If still need cards for arbitrary custom topics, generate parameterized unique cards
  if (results.length < count) {
    const dynamicAngles = [
      { aspect: 'Performance Optimization', q: `What key techniques are used for optimizing ${topic}?`, a: `Involves reducing algorithmic bottlenecks, caching computed states, and scaling resources horizontally.` },
      { aspect: 'Security & Robustness', q: `What are the primary security considerations in ${topic}?`, a: `Input validation, rate limiting, defense in depth, encryption at rest/transit, and adherence to least-privilege principles.` },
      { aspect: 'Real-World Applications', q: `What is a prominent enterprise use case for ${topic}?`, a: `Automating production workflows, real-time analytics pipelines, and decision-support engines in high-throughput environments.` },
      { aspect: 'Key Trade-offs', q: `What are the fundamental engineering trade-offs when implementing ${topic}?`, a: `Balancing execution latency versus resource consumption, maintainability versus raw performance, and modularity.` },
      { aspect: 'Future Trends', q: `What emerging developments are defining the future of ${topic}?`, a: `Standardization of protocols, integration with self-improving autonomous systems, and hardware-accelerated execution.` },
      { aspect: 'Debugging & Monitoring', q: `How do practitioners monitor and debug issues in ${topic}?`, a: `Using structured telemetry, distributed tracing, automated regression tests, and anomaly detection dashboards.` },
      { aspect: 'Architecture Principles', q: `What architectural pattern is most effective for ${topic}?`, a: `Decoupled modular architecture with explicit interface boundaries, event-driven communication, and state isolation.` }
    ];

    for (const angle of dynamicAngles) {
      if (results.length >= count) break;
      if (!isDuplicate(angle.q, knownQuestions)) {
        results.push({
          id: `dyn-${Date.now()}-${results.length}-${Math.random().toString(36).substring(2, 6)}`,
          question: angle.q,
          answer: angle.a,
          topic,
          difficulty: 'Medium',
          category: angle.aspect
        });
        knownQuestions.push(angle.q);
      }
    }
  }

  return results.slice(0, count);
}

export function getFallbackCards(topic: string, count: number = 5): Flashcard[] {
  if (topic.toLowerCase().includes('machine learning')) {
    return ML_EXPANSION_POOL.slice(0, count).map((item, idx) => ({
      id: `ml-card-${idx}`,
      question: item.question,
      answer: item.answer,
      topic,
      difficulty: item.difficulty,
      category: item.category
    }));
  }
  return INITIAL_CARDS.slice(0, count);
}