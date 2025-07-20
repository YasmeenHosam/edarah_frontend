import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor() {}

  /**
   * Show a success notification
   */
  showSuccess(title: string, message: string, duration: number = 5000) {
    this.addNotification('success', title, message, duration);
  }

  /**
   * Show an error notification
   */
  showError(title: string, message: string, persistent: boolean = false) {
    this.addNotification('error', title, message, persistent ? 0 : 8000, persistent);
  }

  /**
   * Show a warning notification
   */
  showWarning(title: string, message: string, duration: number = 6000) {
    this.addNotification('warning', title, message, duration);
  }

  /**
   * Show an info notification
   */
  showInfo(title: string, message: string, duration: number = 4000) {
    this.addNotification('info', title, message, duration);
  }

  /**
   * Show plan upgrade notification
   */
  showPlanUpgrade(planName: string) {
    this.showSuccess(
      'تم تفعيل الباقة بنجاح! 🎉',
      `تم تفعيل باقة ${planName} بنجاح. يمكنك الآن الاستفادة من جميع المميزات الجديدة.`,
      8000
    );
  }

  /**
   * Show plan limit warning
   */
  showPlanLimitWarning(currentPlan: string, feature: string) {
    this.showWarning(
      'تم الوصول لحد الباقة',
      `لقد وصلت لحد باقة ${currentPlan} في ${feature}. قم بالترقية للاستمرار.`,
      7000
    );
  }

  /**
   * Add a notification
   */
  private addNotification(
    type: Notification['type'], 
    title: string, 
    message: string, 
    duration: number = 5000,
    persistent: boolean = false
  ) {
    const notification: Notification = {
      id: this.generateId(),
      type,
      title,
      message,
      duration,
      persistent,
      timestamp: new Date()
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-remove notification after duration (if not persistent)
    if (!persistent && duration > 0) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, duration);
    }

    console.log(`🔔 Notification: [${type.toUpperCase()}] ${title} - ${message}`);
  }

  /**
   * Remove a notification
   */
  removeNotification(id: string) {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  /**
   * Clear all notifications
   */
  clearAll() {
    this.notificationsSubject.next([]);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
