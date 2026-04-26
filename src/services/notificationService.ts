
/**
 * Mock notification service for TravelBank Ultra
 */

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: 'transaction' | 'booking' | 'promotion' | 'alert' | 'reminder' | 'system';
  read: boolean;
  timestamp: string;
  data?: Record<string, unknown>;
  icon?: string;
  actionUrl?: string;
}

const generateNotifications = (): AppNotification[] => {
  const notifications: AppNotification[] = [
    {
      id: '1', title: 'Payment Received', body: 'You received ₹5,000 from Rahul Kumar via UPI', type: 'transaction', read: false,
      timestamp: new Date(Date.now() - 300000).toISOString(), icon: '💰', data: { amount: 5000, sender: 'Rahul Kumar' },
    },
    {
      id: '2', title: 'Flight Booking Confirmed', body: 'Your flight AI-302 DEL→BOM on 25 Dec is confirmed', type: 'booking', read: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(), icon: '✈️', data: { bookingId: 'BK12345' },
    },
    {
      id: '3', title: 'Flash Sale Alert! 🎉', body: 'Flat 40% off on domestic flights. Book now!', type: 'promotion', read: true,
      timestamp: new Date(Date.now() - 7200000).toISOString(), icon: '🎫',
    },
    {
      id: '4', title: 'Low Balance Alert', body: 'Your HDFC savings account balance is below ₹10,000', type: 'alert', read: false,
      timestamp: new Date(Date.now() - 14400000).toISOString(), icon: '⚠️', data: { accountId: 'ACC001' },
    },
    {
      id: '5', title: 'Bill Due Tomorrow', body: 'Electricity bill of ₹2,450 is due tomorrow', type: 'reminder', read: true,
      timestamp: new Date(Date.now() - 28800000).toISOString(), icon: '⚡', data: { billId: 'BILL001' },
    },
    {
      id: '6', title: 'Hotel Check-in Reminder', body: 'Your check-in at Taj Palace is tomorrow at 2:00 PM', type: 'booking', read: false,
      timestamp: new Date(Date.now() - 43200000).toISOString(), icon: '🏨',
    },
    {
      id: '7', title: 'Monthly Statement Ready', body: 'Your December 2024 account statement is ready to download', type: 'system', read: true,
      timestamp: new Date(Date.now() - 86400000).toISOString(), icon: '📄',
    },
    {
      id: '8', title: 'Train Delay Alert', body: 'Rajdhani Express 12301 is delayed by 45 minutes', type: 'alert', read: false,
      timestamp: new Date(Date.now() - 172800000).toISOString(), icon: '🚂',
    },
    {
      id: '9', title: 'Investment Update', body: 'Your mutual fund portfolio gained ₹2,340 today', type: 'transaction', read: true,
      timestamp: new Date(Date.now() - 259200000).toISOString(), icon: '📈',
    },
    {
      id: '10', title: 'SIP Deducted', body: '₹5,000 SIP installment deducted for Axis Bluechip Fund', type: 'transaction', read: true,
      timestamp: new Date(Date.now() - 345600000).toISOString(), icon: '💳',
    },
    {
      id: '11', title: 'New Reward Earned! 🏆', body: 'You earned 500 reward points from your last transaction', type: 'promotion', read: false,
      timestamp: new Date(Date.now() - 432000000).toISOString(), icon: '🏆',
    },
    {
      id: '12', title: 'Price Drop Alert', body: 'Flight prices to Goa dropped by 25%. Book now!', type: 'promotion', read: true,
      timestamp: new Date(Date.now() - 518400000).toISOString(), icon: '📉',
    },
    {
      id: '13', title: 'Card Transaction', body: '₹1,250 spent at Amazon using HDFC Credit Card', type: 'transaction', read: true,
      timestamp: new Date(Date.now() - 604800000).toISOString(), icon: '🛒',
    },
    {
      id: '14', title: 'Auto-pay Success', body: 'Mobile recharge of ₹599 auto-paid via UPI', type: 'system', read: true,
      timestamp: new Date(Date.now() - 691200000).toISOString(), icon: '📱',
    },
    {
      id: '15', title: 'Security Alert', body: 'New device login detected from Chrome on Windows', type: 'alert', read: false,
      timestamp: new Date(Date.now() - 777600000).toISOString(), icon: '🔒',
    },
  ];
  return notifications;
};

export const notificationService = {
  getNotifications: async (): Promise<AppNotification[]> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(generateNotifications()), 800);
    });
  },

  getUnreadCount: async (): Promise<number> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const notifications = generateNotifications();
        resolve(notifications.filter(n => !n.read).length);
      }, 300);
    });
  },

  markAsRead: async (id: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 200);
    });
  },

  markAllAsRead: async (): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 300);
    });
  },

  deleteNotification: async (id: string): Promise<boolean> => {
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 200);
    });
  },

  getByType: async (type: AppNotification['type']): Promise<AppNotification[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(generateNotifications().filter(n => n.type === type));
      }, 500);
    });
  },
};

export default notificationService;
