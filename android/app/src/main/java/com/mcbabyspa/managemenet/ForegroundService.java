package com.mcbabyspa.managemenet;

import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;
import java.util.Timer;
import java.util.TimerTask;

public class ForegroundService extends Service {
    private Intent mIntent;
    private static final String TAG = "ForegroundService";
    private Timer timer;
    private int logInt = 0;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        ForegroundNotification.startForeground(this);
        timer = new Timer();

        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                Log.d(TAG, "Timer task " + logInt++);
            }
        }, 0L, 300L);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) {
            //服务被系统kill掉之后重启进来的
            return START_NOT_STICKY;
        }
        mIntent = intent;
        ForegroundNotification.startForegroundIfNeed(this);
        if (ServiceHelper.isCancelNotice()) {
            Log.d(TAG, "onStartCommand: CancelNoticeService");
            Intent intent1 = new Intent(this, CancelNoticeService.class);
            startService(intent1);
        }
        return super.onStartCommand(intent, flags, startId);
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        Log.d(TAG, "onDestroy: " + timer);

        if (timer != null) {
            timer.cancel();
        }
        ForegroundNotification.stopForeground(this);
        // 重启自己
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && mIntent != null) {
            this.startForegroundService(mIntent);
        }
    }
}