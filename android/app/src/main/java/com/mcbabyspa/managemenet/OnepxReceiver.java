package com.mcbabyspa.managemenet;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class OnepxReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent.getAction().equals(Intent.ACTION_SCREEN_OFF)) { // 屏幕关闭的时候接受到广播
            Intent it = new Intent(context, OnepxActivity.class);
            it.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(it);
            Log.d("OnepxReceiver", "-------screen off");
        } else if (intent.getAction().equals(Intent.ACTION_SCREEN_ON)) { // 屏幕打开的时候发送广播  结束一像素
            context.sendBroadcast(new Intent("finish activity"));
            Log.d("OnepxReceiver", "------screen on");
            Intent home = new Intent(Intent.ACTION_MAIN);
            home.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            home.addCategory(Intent.CATEGORY_HOME);
            context.startActivity(home);
        }
    }
}