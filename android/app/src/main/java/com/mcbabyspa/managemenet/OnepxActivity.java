package com.mcbabyspa.managemenet;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.os.PowerManager;
import android.util.Log;
import android.view.Gravity;
import android.view.WindowManager;

public class OnepxActivity extends Activity {
    private BroadcastReceiver br;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WindowManager.LayoutParams params = new WindowManager.LayoutParams();
        params.gravity = Gravity.LEFT | Gravity.TOP;
        params.x = 0;
        params.y = 0;
        params.height = 1;
        params.width = 1;
        getWindow().setAttributes(params);

        // 结束该页面的广播
        br = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                Log.d("OnepxActivity", "OnepxActivity finish == ==============");
                finish();
            }
        };
        registerReceiver(br, new IntentFilter("finish activity"));

        checkScreenOn("onCreate");
    }

    /**
     * 检查屏幕状态 isScreenOn为true 屏幕“亮”结束该Activity
     */
    private void checkScreenOn(String methodName) {
        Log.d("OnepxActivity", "from call method: " + methodName);
        PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
        boolean isScreenOn = pm.isScreenOn();
        Log.d("OnepxActivity", "isScreenOn: " + isScreenOn);
        if (isScreenOn) {
            finish();
        }
    }

    @Override
    protected void onDestroy() {
        Log.d("OnepxActivity", "===onDestroy===");
        try {
            unregisterReceiver(br);
        } catch (IllegalArgumentException e) {
            Log.d("OnepxActivity", "receiver is not registered: " + e);
        }
        super.onDestroy();
    }

    @Override
    protected void onResume() {
        super.onResume();
        checkScreenOn("onResume");
    }
}