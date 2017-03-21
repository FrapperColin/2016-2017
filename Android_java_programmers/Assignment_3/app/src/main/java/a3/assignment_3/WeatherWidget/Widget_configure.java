package a3.assignment_3.WeatherWidget;

import android.app.Activity;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import a3.assignment_3.R;

public class Widget_configure extends Activity
{

    private ListView lv;
    private ArrayAdapter<String> adapter;
    private final String[] cities = { "Växjö", "Paris", "Stockholm" };
    private int appWidgetId;

    private static final String PREFS_NAME = "WeatherConfiguration";
    private static final String PREF_KEY_CITY = "city";
    private static final String PREF_KEY_CONFIG = "Config";

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // set result to canceled in case user aborts configuration
        setResult(RESULT_CANCELED);
        setContentView(R.layout.widget_configure);

        // Find widget Id from Intent
        Intent intent = getIntent();
        Bundle extras = intent.getExtras();
        if (extras != null)
        {
            appWidgetId = extras.getInt(AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID);
        }

        // getting listview, setting adapter, creating onitemclicklistener
        lv = (ListView) findViewById(R.id.configuration_list);
        adapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, cities);
        lv.setAdapter(adapter);
        lv.setOnItemClickListener(new OnItemClick());

        // If intent has no widget with id -> finish
        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID)
        {
            finish();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.widget_configure_menu, menu);
        return true;
    }

    // Define what happens on ListItemClick
    public class OnItemClick implements AdapterView.OnItemClickListener {

        @Override
        public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3) {

            // get context
            Context context = Widget_configure.this;
            // get city configuration
            String city = (String) lv.getItemAtPosition(arg2);
            // save city preference
            savePrefs(context, appWidgetId, city);

            // telling appwidgetmanager to update
            AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(getBaseContext());
            Weather_widget ww = new Weather_widget();
            ww.updateAppWidget(context, appWidgetManager, appWidgetId, city);

            Intent resultValue = new Intent();
            resultValue.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId);
            resultValue.putExtra("city", city);
            setResult(RESULT_OK, resultValue);
            finish();

        }

    }

   /**
         * save choosen city for specific appwidget
         *
         * @param context
         * @param appWidgetId2
         * @param city
    */
    public void savePrefs(Context context, int appWidgetId2, String city)
    {
        SharedPreferences.Editor prefs = context.getSharedPreferences(PREFS_NAME, 0).edit();
        prefs.putString(PREF_KEY_CITY + appWidgetId, city);
        prefs.putBoolean(PREF_KEY_CONFIG + appWidgetId, true);
        prefs.commit();
    }

    // Read the prefix from the SharedPreferences object for this widget.
    // If there is no preference saved, get the default from a resource
    static String loadCityPref(Context context, int appWidgetId)
    {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, 0);
        String prefix = prefs.getString(PREF_KEY_CITY + appWidgetId, null);
        if (prefix != null)
        {
            return prefix;
        }
        else
        {
            return context.getString(R.string.title_widget_configure);
        }
    }

    /**
     * delete the preferences set for a specific widget
     *
     * @param context
     * @param appWidgetId
    */
    static void deleteTitlePref(Context context, int appWidgetId)
    {
        context.getSharedPreferences(PREFS_NAME, 0).edit().remove(PREF_KEY_CITY + appWidgetId).commit();
    }

    /**
     * @param context
     * @param appWidgetId2
     * @return
    */
    public static boolean loadBoolPref(Context context, int appWidgetId2)
    {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, 0);
        boolean bool = prefs.getBoolean(PREF_KEY_CONFIG + appWidgetId2, true);
        return bool;
    }

}
