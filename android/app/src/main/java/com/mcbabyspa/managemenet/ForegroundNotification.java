package com.mcbabyspa.managemenet;

import android.annotation.SuppressLint;
import android.app.*;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.service.notification.StatusBarNotification;

import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

import com.mcbabyspa.managemenet.MainActivity;

public class ForegroundNotification {
    private static final String CHANNEL_FOREGROUND = "foreground-notification";
    public static final int NOTICE_ID = 233;
    @SuppressLint("StaticFieldLeak")
    private static Service service;

    private static void createChannelIfNeeded(Context context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;

        NotificationChannel foregroundChannel =
                new NotificationChannel(CHANNEL_FOREGROUND, "前台服务", NotificationManager.IMPORTANCE_MIN);
        foregroundChannel.setShowBadge(false);
        foregroundChannel.enableLights(false);
        foregroundChannel.enableVibration(false);
        foregroundChannel.setLockscreenVisibility(Notification.VISIBILITY_SECRET);

        NotificationManager notificationManager = ContextCompat.getSystemService(context, NotificationManager.class);
        if (notificationManager != null) {
            notificationManager.createNotificationChannel(foregroundChannel);
        }
    }

    public static void startForeground(Service service) {
        ForegroundNotification.service = service;
        createChannelIfNeeded(service);
        int pendingIntentFlags = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S
                ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
                : PendingIntent.FLAG_UPDATE_CURRENT;

        PendingIntent pendingIntent = PendingIntent.getActivity(
                service,
                0,
                new Intent(service, MainActivity.class),
                pendingIntentFlags
        );

        Notification notification = new NotificationCompat.Builder(service, CHANNEL_FOREGROUND)
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentText("手策正在运行，请勿清理应用避免消息无法及时触达。")
                .setContentIntent(pendingIntent)
                .setLocalOnly(true)
                .setPriority(NotificationCompat.PRIORITY_MIN)
                .setCategory(NotificationCompat.CATEGORY_SERVICE)
                .setVisibility(NotificationCompat.VISIBILITY_SECRET)
                .setOngoing(true)
                .setShowWhen(false)
                .build();
        service.startForeground(NOTICE_ID, notification);
    }

    public static void stopForeground(Service service) {
        NotificationManager manager = (NotificationManager) service.getSystemService(Service.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.cancel(NOTICE_ID);
        }
        service.stopForeground(true);
    }

    public static void cancelNotice(Service service) {
        NotificationManager manager = (NotificationManager) service.getSystemService(Service.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.cancel(NOTICE_ID);
        }
    }

    public static void stopForeground() {
        if (service != null) {
            NotificationManager manager = (NotificationManager) service.getSystemService(Service.NOTIFICATION_SERVICE);
            if (manager != null) {
                manager.cancel(NOTICE_ID);
            }
            service.stopForeground(true);
        }
    }

    public static void startForegroundIfNeed(Service service) {
        NotificationManager manager = (NotificationManager) service.getSystemService(Service.NOTIFICATION_SERVICE);
        boolean needStart = true;
        if (manager != null) {
            StatusBarNotification[] activeNotifications = new StatusBarNotification[0];
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
                activeNotifications = manager.getActiveNotifications();
            }
            for (StatusBarNotification notification : activeNotifications) {
                if (notification.getId() == NOTICE_ID) {
                    needStart = false;
                    break;
                }
            }
        }
        if (needStart) {
            startForeground(service);
        }
    }
}