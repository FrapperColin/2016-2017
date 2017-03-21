package a3.assignment_3.WeatherWidget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.provider.Settings;
import android.widget.RemoteViews;
import android.widget.Toast;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import a3.assignment_3.R;

/**
 * @author Colin FRAPPER
 * @date 24/10/2016
 */

public class Weather_widget  extends AppWidgetProvider
{
    private static URL url;
    private WeatherReport report = null;
    private static RemoteViews views;
    private AppWidgetManager appWidgetManager;
    private int appWidgetId;
    private String city;


    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds)
    {

        this.appWidgetManager = appWidgetManager;

        Intent serviceIntent = new Intent(context.getApplicationContext(), UpdateService.class);
        serviceIntent.putExtra("appWidgetIds", appWidgetIds);
        context.startService(serviceIntent);
    }


    public void onReceive(Context context, Intent intent)
    {
        if (intent.getExtras() != null)
        {
            int id = intent.getIntExtra("id", 0);
            if (intent.getAction().equalsIgnoreCase("UPDATE_WEATHER") || intent.getAction().equalsIgnoreCase("android.appwidget.action.APPWIDGET_ENABLED"))
            {
                if (appWidgetManager == null)
                    appWidgetManager = AppWidgetManager.getInstance(context);

                int[] appWidgetIds = { id };
                onUpdate(context, appWidgetManager, appWidgetIds);

            }

        }
    }

    /**
     * When the user deletes the widget, delete the preference associated with it.

    */
    @Override
    public void onDeleted(Context context, int[] appWidgetIds)
    {

        final int N = appWidgetIds.length;
        for (int i = 0; i < N; i++) {
            Widget_configure.deleteTitlePref(context, appWidgetIds[i]);
        }
    }

    /**
     * called on restart of device
     */
    @Override
    public void onEnabled(Context context)
    {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        int[] allIds = manager.getAppWidgetIds(new ComponentName(context, Widget_activity.class));
        onUpdate(context, manager, allIds);
        super.onEnabled(context);
    }

    /**
     * updating weather data for specific widget
     *
     * @param context
     * @param appWidgetManager
     * @param appWidgetId
     * @param city
     */
    public void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId, String city)
    {

        this.appWidgetManager = appWidgetManager;
        this.appWidgetId = appWidgetId;
        this.city = city;

        views = new RemoteViews(context.getPackageName(), R.layout.weather_widget);
        final Intent intent = new Intent(context, VaxjoWeather.class);
        intent.putExtra("city", city);
        final PendingIntent pending = PendingIntent.getActivity(context, appWidgetId, intent, 0);
        views.setOnClickPendingIntent(R.id.widget, pending);

        final Intent in = new Intent(context, Weather_widget.class);
        String action = "UPDATE_WEATHER";
        in.putExtra("city", city);
        in.putExtra("id", appWidgetId);
        in.setAction(action);
        final PendingIntent pendIn = PendingIntent.getBroadcast(context, appWidgetId, in, 0);
        views.setOnClickPendingIntent(R.id.btn_update, pendIn);
        appWidgetManager.updateAppWidget(appWidgetId, views);
        updateCity(city, context);

    }

    /**
     * downloading new weather data
     *
     * @param city
     * @param context
     */
    public void updateCity(String city, Context context)
    {
        if (city.equalsIgnoreCase("växjö"))
        {
            try
            {
                url = new URL("http://www.yr.no/sted/Sverige/Kronoberg/V%E4xj%F6/forecast.xml");
            } catch (IOException ioe) {
                ioe.printStackTrace();
            }
        }
        else if (city.equalsIgnoreCase("Paris"))
        {
            try
            {
                url = new URL("http://www.yr.no/place/France/%C3%8Ele-de-France/Paris/forecast.xml");
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }
        else if (city.equalsIgnoreCase("Stockholm"))
        {
            try {
                url = new URL("http://www.yr.no/place/Sweden/Stockholm/Stockholm/forecast.xml");
            } catch (MalformedURLException e) {
                e.printStackTrace();
            }
        }
        else
        {
            Toast toast = Toast.makeText(context, "No data available", Toast.LENGTH_LONG);
            toast.show();
        }
        createWeatherReport(context);
    }

    /**
     * create weather report
     *
     * @param context
     */
    private void createWeatherReport(Context context)
    {
        if (!ModeOn(context))
        {
            new WeatherRetriever().execute(url);
        }
    }

    /**
     * checking if airplanemode is on
     *
     * @param context
     * @return
     */
    @SuppressWarnings("deprecation")
    private static boolean ModeOn(Context context)
    {
        return Settings.System.getInt(context.getContentResolver(), Settings.System.AIRPLANE_MODE_ON, 0) != 0;
    }


    private class WeatherRetriever extends AsyncTask<URL, Void, WeatherReport>
    {
        protected WeatherReport doInBackground(URL... urls)
        {
            try
            {
                return WeatherHandler.getWeatherReport(urls[0]);
            }
            catch (Exception e)
            {
                throw new RuntimeException(e);
            }
        }

        protected void onProgressUpdate(Void... progress)
        {}

        protected void onPostExecute(WeatherReport result)
        {
            report = result;
            if (report != null)
            {
                for (int i = 0; i < 1; i++)
                {
                    WeatherForecast fc = report.getForecasts().get(i);
                    setViews(fc);
                }
            }
            else
            {
                System.out.println("Sorry, we didn't found weather report");
            }
        }
    }

    private void setViews(WeatherForecast fc)
    {
        views.setTextViewText(R.id.rain, "Rain: " + fc.getRain());
        views.setTextViewText(R.id.temp, "Temp: " + fc.getTemp());
        views.setTextViewText(R.id.wind, "Wind: " + fc.getWindSpeed());
        views.setTextViewText(R.id.city, city);
        int ResImages;
        switch (fc.getWeatherCode()) {
            case (1):
                ResImages = R.drawable.sunny;
            case (2):
                ResImages = R.drawable.fair;
                break;
            case (3):
                ResImages = R.drawable.partly_cloudy;
                break;
            case (4):
                ResImages = R.drawable.cloudy;
                break;
            case (5):
                ResImages = R.drawable.rain_showers;
                break;
            case (6):
                ResImages = R.drawable.rain_showers_thunder;
                break;
            case (7):
                ResImages = R.drawable.sleet_showers;
                break;
            case (8):
                ResImages = R.drawable.snow_showers;
                break;
            case (9):
                ResImages = R.drawable.rain;
                break;
            case (10):
                ResImages = R.drawable.heavy_rain;
                break;
            case (11):
                ResImages = R.drawable.rain_and_thunder;
                break;
            case (12):
                ResImages = R.drawable.sleet;
                break;
            case (13):
                ResImages = R.drawable.snow;
                break;
            case (14):
                ResImages = R.drawable.snow_thunder;
                break;
            case (15):
                ResImages = R.drawable.fog;
                break;
            default:
                ResImages = R.drawable.na;
        }
        views.setImageViewResource(R.id.symbol, ResImages);
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}