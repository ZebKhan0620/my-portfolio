import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createLogger } from '@/lib/logging';

// Create a logger for Japanese advice API
const logger = createLogger('ja-advice-api');

export interface AdviceEntry {
  _id: string;
  name: string;
  message: string;
  role: string;
  timestamp: number;
}

// Professional sample advice entries in Japanese
const sampleAdvice: AdviceEntry[] = [
  {
    _id: uuidv4(),
    name: '田中 亜里沙',
    message: '最新のフレームワークを追いかけるよりも、システムアーキテクチャの基礎を優先的に学びましょう。基本原則の確かな理解は、技術が進化しても一生役立ちます。',
    role: 'シニアソフトウェアアーキテクト',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
  },
  {
    _id: uuidv4(),
    name: '佐藤 誠一郎',
    message: 'ドキュメントは後回しではなく、開発の重要な構成要素です。明確で包括的なドキュメントは協業を促進し、導入を加速させ、保守フェーズでの貴重なリソースとなります。',
    role: 'エンジニアリングディレクター',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 days ago
  },
  {
    _id: uuidv4(),
    name: '鈴木 美咲',
    message: 'キャリア初期にバージョン管理ワークフローをマスターする時間を投資してください。ブランチ戦略、コンフリクト解決、協働開発プラクティスを理解することで、プロフェッショナルな開発者として際立ちます。',
    role: 'DevOpsエンジニア',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
  },
  {
    _id: uuidv4(),
    name: '山田 拓也',
    message: 'ユニット、統合、エンドツーエンドテストを含む包括的なテスト手法を開発しましょう。早期に実装された品質保証プロセスは、後の開発段階で指数関数的に時間を節約します。',
    role: 'QAリード',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
  },
  {
    _id: uuidv4(),
    name: '中村 真理子',
    message: 'プロジェクト開始時からアクセシブルなデジタル体験の創出に焦点を当てましょう。ユニバーサルデザインの原則は、すべてのユーザーに公平にサービスを提供し、多くの場合全体的なユーザー体験を向上させます。',
    role: 'UXリサーチディレクター',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
  },
  {
    _id: uuidv4(),
    name: '伊藤 健太郎',
    message: '業界に入る際は、一般的なアドバイスではなく、文脈特有のガイダンスを提供できるメンターを見つけましょう。領域知識と実践的な知恵は、理論的な学習をはるかに超えて専門的成長を加速させます。',
    role: 'テクニカルメンター',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 14, // 14 days ago
  },
  {
    _id: uuidv4(),
    name: '小林 さくら',
    message: '技術的専門知識と共に強力なコミュニケーションスキルを育みましょう。多様なステークホルダーに複雑な概念を明確に説明する能力は、多くの場合、技術的な熟練度以上にプロジェクトの成功を決定します。',
    role: 'プロダクトマネージャー',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 20, // 20 days ago
  },
  {
    _id: uuidv4(),
    name: '高橋 洋平',
    message: '技術的決定のビジネスコンテキストを理解しましょう。ソリューションを組織の目標に合わせるエンジニアは、技術的な洗練さだけに焦点を当てる人よりも指数関数的に多くの価値を提供します。',
    role: 'CTO',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 30, // 30 days ago
  }
];

// In-memory storage for development
let adviceStore: AdviceEntry[] = [...sampleAdvice];

// GET handler to retrieve all Japanese advice
export async function GET() {
  try {
    logger.info('Successfully retrieved Japanese advice entries');
    return NextResponse.json({ success: true, data: adviceStore });
  } catch (error) {
    logger.error('Error fetching Japanese advice', error);
    return NextResponse.json(
      { success: false, error: 'リクエスト処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// POST handler to create new Japanese advice
export async function POST(request: Request) {
  try {
    logger.info('Processing new Japanese advice submission');
    const body = await request.json();
    
    const { name, message, role = '' } = body;
    
    // Validate required fields
    if (!name?.trim() || !message?.trim()) {
      logger.warn('Validation failed: Missing required fields');
      return NextResponse.json(
        { success: false, error: '名前とメッセージは必須です' },
        { status: 400 }
      );
    }
    
    const newAdvice: AdviceEntry = {
      _id: uuidv4(),
      name: name.trim(),
      message: message.trim(),
      role: role?.trim() || '',
      timestamp: Date.now(),
    };
    
    adviceStore.unshift(newAdvice); // Add to beginning of array
    logger.info('Successfully created new Japanese advice entry');
    
    return NextResponse.json({ 
      success: true, 
      data: newAdvice 
    }, { status: 201 });
  } catch (error) {
    logger.error('Error creating Japanese advice', error);
    return NextResponse.json(
      { success: false, error: 'リクエスト処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 