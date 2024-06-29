package com.mcbabyspa.managemenet;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

public class ServiceHelper {

    private static boolean cancelNotice = false;

    public static boolean isCancelNotice() {
        return cancelNotice;
    }

    public static void setCancelNotice(boolean cancelNotice) {
        ServiceHelper.cancelNotice = cancelNotice;
    }

    public static void startForegroundService(Context context) {
        Intent intent = new Intent(context, ForegroundService.class);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent);
        } else {
            context.startService(intent);
        }
    }

    public static void hideBackground(Context context, boolean hide) {
        ActivityManager activityManager = (ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE);
        if (activityManager != null && activityManager.getAppTasks().size() > 0) {
            activityManager.getAppTasks().get(0).setExcludeFromRecents(hide);
        }
    }

    public static void ignoreBattery(Activity activity) {
        Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
        intent.setData(Uri.parse("package:" + activity.getPackageName()));
        activity.startActivityForResult(intent, 1);
    }

    public static void startAccessibilitySetting(Activity activity) {
        try {
            Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}