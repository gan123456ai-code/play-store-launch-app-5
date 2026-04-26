
/**
 * Mock AI Assistant service for TravelBank Ultra
 */

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

const aiResponses: Record<string, { response: string; suggestions: string[] }> = {
  default: {
    response: "I'm TravelBank AI, your premium travel and banking assistant. How can I help you today?",
    suggestions: ['Find cheap flights', 'Check my balance', 'Book a hotel', 'Pay a bill'],
  },
  flights: {
    response: "I can help you find the best flight deals! Based on trending routes, flights to Goa start at ₹2,499 and Mumbai to Delhi is available from ₹3,199. Would you like me to search for specific routes?",
    suggestions: ['Search DEL to BOM', 'Show cheapest flights', 'Flight status check', 'Compare airlines'],
  },
  hotels: {
    response: "Looking for the perfect stay? I found 15+ hotels in your searched locations with ratings 4.5+ stars. I can help you compare prices, amenities, and find the best deals with up to 30% cashback!",
    suggestions: ['Show 5-star hotels', 'Budget stays under ₹2000', 'Hotels with pool', 'Resort packages'],
  },
  banking: {
    response: "Your banking overview: Your total balance across all accounts is ₹18,55,440. You have 3 pending bills totaling ₹5,400 due this week. Your investments grew by 8.5% this quarter! 📊",
    suggestions: ['Send money', 'Pay pending bills', 'Investment advice', 'Spending analysis'],
  },
  investments: {
    response: "Your investment portfolio is performing well! 📈 Mutual funds: +12.8% returns, FD: ₹2,88,560 maturing in 6 months, Gold: ₹15,000 profit. I recommend increasing your SIP by ₹2,000 for better returns.",
    suggestions: ['Start new SIP', 'FD calculator', 'Gold investment', 'Portfolio review'],
  },
  bills: {
    response: "You have 3 upcoming bills: Electricity ₹2,450 (due tomorrow), Mobile ₹599 (due in 3 days), and Broadband ₹999 (due next week). Would you like me to set up auto-pay for these?",
    suggestions: ['Pay all bills', 'Set auto-pay', 'Bill history', 'Recharge mobile'],
  },
  trains: {
    response: "Popular train routes this week: Rajdhani Express (DEL-MUM) has 5 tickets available. Shatabdi Express (DEL-AGR) morning slot is filling fast. Shall I check availability for you?",
    suggestions: ['Search trains', 'PNR status', 'Train schedule', 'Platform info'],
  },
  savings: {
    response: "Based on your spending patterns, here are my savings tips: 1) Switch to a no-fee credit card to save ₹1,200/year 2) Use auto-invest to save ₹5,000/month 3) Consolidate your bills for 5% cashback. These changes could save you ₹45,000 annually! 💡",
    suggestions: ['Show savings plan', 'Auto-invest setup', 'Budget analysis', 'Cashback offers'],
  },
};

const getResponseForQuery = (query: string): { response: string; suggestions: string[] } => {
  const lowerQuery = query.toLowerCase();
  if (lowerQuery.includes('flight') || lowerQuery.includes('fly') || lowerQuery.includes('airport')) return aiResponses.flights;
  if (lowerQuery.includes('hotel') || lowerQuery.includes('stay') || lowerQuery.includes('room')) return aiResponses.hotels;
  if (lowerQuery.includes('bank') || lowerQuery.includes('balance') || lowerQuery.includes('account') || lowerQuery.includes('money')) return aiResponses.banking;
  if (lowerQuery.includes('invest') || lowerQuery.includes('mutual') || lowerQuery.includes('fd') || lowerQuery.includes('gold') || lowerQuery.includes('stock')) return aiResponses.investments;
  if (lowerQuery.includes('bill') || lowerQuery.includes('recharge') || lowerQuery.includes('electricity') || lowerQuery.includes('pay')) return aiResponses.bills;
  if (lowerQuery.includes('train') || lowerQuery.includes('rail') || lowerQuery.includes('bus')) return aiResponses.trains;
  if (lowerQuery.includes('save') || lowerQuery.includes('budget') || lowerQuery.includes('tip') || lowerQuery.includes('advice')) return aiResponses.savings;
  return aiResponses.default;
};

export const aiService = {
  sendMessage: async (query: string): Promise<AIMessage> => {
    return new Promise(resolve => {
      const delay = 800 + Math.random() * 1200;
      setTimeout(() => {
        const { response, suggestions } = getResponseForQuery(query);
        resolve({
          id: 'ai_' + Date.now(),
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
          suggestions,
        });
      }, delay);
    });
  },

  getGreeting: async (): Promise<AIMessage> => {
    const hour = new Date().getHours();
    let greeting: string;
    if (hour < 12) greeting = "Good morning! ☀️ Ready to plan your next adventure or manage your finances?";
    else if (hour < 17) greeting = "Good afternoon! 🌤️ How can I assist you with your travel or banking needs?";
    else greeting = "Good evening! 🌙 Let me help you with travel plans or banking tasks.";

    return {
      id: 'greeting_' + Date.now(),
      role: 'assistant',
      content: greeting,
      timestamp: new Date().toISOString(),
      suggestions: ['Search flights', 'Check balance', 'Pay bills', 'Investment tips'],
    };
  },

  getQuickActions: (mode: 'travel' | 'banking'): string[] => {
    if (mode === 'travel') {
      return ['🔍 Search Flights', '🏨 Find Hotels', '🚂 Book Train', '📋 My Bookings', '💰 Travel Deals', '✈️ Flight Status'];
    }
    return ['💸 Send Money', '📊 Balance', '📱 Recharge', '💳 Pay Bill', '📈 Investments', '🏦 Account Statement'];
  },
};

export default aiService;
