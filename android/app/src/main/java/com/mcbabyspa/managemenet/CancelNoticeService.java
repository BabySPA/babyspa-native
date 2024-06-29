package com.mcbabyspa.managemenet;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.os.SystemClock;
import android.util.Log;

public class CancelNoticeService extends Service {
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            // 服务被系统kill掉之后重启进来的
            return START_NOT_STICKY;
        }
        ForegroundNotification.startForeground(this);
        new Thread(() -> {
            SystemClock.sleep(1000);
                stopForeground(true);
            Log.d("ForegroundService", "CancelNoticeService onStartCommand: CancelNoticeService");
            ForegroundNotification.stopForeground(this);
        }).start();
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d("ForegroundService", "onDestroy: CancelNoticeService");
    }
}