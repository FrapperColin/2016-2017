package a3.assignment_3.WeatherWidget;

import android.app.Service;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.widget.RemoteViews;

import a3.assignment_3.R;

/**
 * @author Colin FRAPPER
 * @date 24/10/2016
 */
public class UpdateService extends Service
{

	private int appWidgetId;
	private String city;
	private RemoteViews views;
	private AppWidgetManager appWidgetManager;

	@Override
	public IBinder onBind(Intent intent)
	{
		return null;
	}

	// called when starting the service
	@Override
	public int onStartCommand(Intent intent, int flags, int startId)
	{
		handleCommand(intent);
		return START_STICKY; // service ends only when we tell it to
	}

	private void handleCommand(Intent intent)
	{
		int[] widgetIds = intent.getIntArrayExtra("appWidgetIds");
		Context context = getBaseContext();

		final int N = widgetIds.length;
		for (int i = 0; i < N; i++)
		{
			this.appWidgetId = widgetIds[i];
			if (Widget_configure.loadBoolPref(context, appWidgetId) == true)
			{
				city = Widget_configure.loadCityPref(context, appWidgetId);
				views = new RemoteViews(context.getPackageName(), R.layout.weather_widget);
				appWidgetManager = AppWidgetManager.getInstance(context);
				Weather_widget ww = new Weather_widget();
				ww.updateAppWidget(context, appWidgetManager, appWidgetId, city);
				ww.updateCity(city, context);
				appWidgetManager.updateAppWidget(appWidgetId, views);
			}
		}
		stopSelf(); // service no longer needed
	}
}
