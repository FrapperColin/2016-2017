package a1.assignment_1;

/**
 * VaxjoWeather.java
 * Created: September 11, 2016
 * Colin FRAPPER
 */

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import android.app.ListActivity;
import android.content.Context;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.Settings;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;


/**
 * This is a first prototype for a weather app. It is currently 
 * only downloading weather data for Växjö. 
 *
 * This activity downloads weather data and constructs a WeatherReport,
 * a data structure containing weather data for a number of periods ahead.
 *
 * The WeatherHandler is a SAX parser for the weather reports
 * (forecast.xml) produced by www.yr.no. The handler constructs
 * a WeatherReport containing meta data for a given location
 * (e.g. city, country, last updated, next update) and a sequence
 * of WeatherForecasts.
 * Each WeatherForecast represents a forecast (weather, rain, wind, etc)
 * for a given time period.
 *
 * The next task is to construct a list based GUI where each row
 * displays the weather data for a single period.
 *
 *
 * @author jlnmsi
 *
 */


public class VaxjoWeather extends ListActivity
{
    private WeatherReport report = null;
    ListView list_view = null;
    ArrayList<WeatherForecast> List_forecast = new ArrayList<WeatherForecast>();
    Context cont = this;
    ListAdapter adapt = null;

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // Look if internet is ok
        if (!ModeOn(getApplicationContext()))
        {
            try
            {
                URL url = new URL("http://www.yr.no/sted/Sverige/Kronoberg/V%E4xj%F6/forecast.xml");
                new WeatherRetriever().execute(url);
            }
            catch (IOException ioe)
            {
                ioe.printStackTrace();
            }
            setContentView(R.layout.vaxjo_weather);
            list_view = (ListView) findViewById(android.R.id.list);
            adapt = new MyAdapter(this);
        }
        else // if not send a message (toast)
        {
            String text = getResources().getString(R.string.Internet);
            Toast toast = Toast.makeText(cont, text, Toast.LENGTH_LONG);
            toast.show();
            System.out.println(text);
        }
    }

    @SuppressWarnings("deprecation")
    private static boolean ModeOn(Context cont)
    {
        return Settings.System.getInt(cont.getContentResolver(),Settings.System.AIRPLANE_MODE_ON, 0) != 0;
    }


    private class WeatherRetriever extends AsyncTask<URL, Void, WeatherReport>
    {
        protected WeatherReport doInBackground(URL... urls)
        {
            try
            {
                return WeatherHandler.getWeatherReport(urls[0]);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }

        protected void onProgressUpdate(Void... progress)
        {

        }

        // Setting Adapter
        protected void onPostExecute(WeatherReport result)
        {
            report = result;
            if (report != null)
            {
                for (WeatherForecast forecast : report)
                {
                    List_forecast.add(forecast);
                    list_view.setAdapter(adapt);
                }
            } else
            {
                String text = "Sorry, we didn't found weather report";
                Toast toast = Toast.makeText(cont, text, Toast.LENGTH_LONG);
                toast.show();
            }
        }
    }

    /**
     * Class MyAdapter
     */
    class MyAdapter extends BaseAdapter implements ListAdapter
    {
        Context cont;
        ArrayList<WeatherForecast> l_forecast;

        public MyAdapter(Context cont)
        {
            this.cont = cont;
            this.l_forecast = List_forecast;
        }

        @Override
        public int getCount()
        {
            return l_forecast.size();
        }

        @Override
        public Object getItem(int position)
        {
            return l_forecast.get(position);
        }

        @Override
        public long getItemId(int position)
        {
            return 0;
        }

        @Override
        // Update of the listView
        public View getView(int position, View convertView, ViewGroup parent)
        {
            View row;
            if (convertView == null)
            {
                LayoutInflater inflater = getLayoutInflater();
                row = inflater.inflate(R.layout.vaxjo_weather_row, parent, false);
            } else
            {
                row = convertView;
            }

            // dependent on weather
            ImageView image = (ImageView) row.findViewById(R.id.Image_weather);
            int ResImages = 0;

            switch (l_forecast.get(position).getWeatherCode())
            {
                case 1:
                    ResImages = R.drawable.sunny;
                case 2:
                    ResImages = R.drawable.fair;
                    break;
                case 3:
                    ResImages = R.drawable.partly_cloudy;
                    break;
                case 4:
                    ResImages = R.drawable.cloudy;
                    break;
                case 5:
                    ResImages = R.drawable.rain_showers;
                    break;
                case 6:
                    ResImages = R.drawable.rain_showers_thunder;
                    break;
                case 7:
                    ResImages = R.drawable.sleet_showers;
                    break;
                case 8:
                    ResImages = R.drawable.snow_showers;
                    break;
                case 9:
                    ResImages = R.drawable.rain;
                    break;
                case 10:
                    ResImages = R.drawable.heavy_rain;
                    break;
                case 11:
                    ResImages = R.drawable.rain_and_thunder;
                    break;
                case 12:
                    ResImages = R.drawable.sleet;
                    break;
                case 13:
                    ResImages = R.drawable.snow;
                    break;
                case 14:
                    ResImages = R.drawable.snow_thunder;
                    break;
                case 15:
                    ResImages = R.drawable.fog;
                    break;
                default:
                    ResImages = R.drawable.na;
            }

            @SuppressWarnings("deprecation")
            Drawable res = getResources().getDrawable(ResImages);
            image.setImageDrawable(res);

            TextView date_start = (TextView) row.findViewById(R.id.Date_start);
            TextView time_start = (TextView) row.findViewById(R.id.Time_start);
            TextView temperature = (TextView) row.findViewById(R.id.temperature_weather);
            TextView wind = (TextView) row.findViewById(R.id.wind);


            date_start.setText(l_forecast.get(position).getStartYYMMDD().toString() + " to " + l_forecast.get(position).getEndYYMMDD().toString());
            time_start.setText(l_forecast.get(position).getStartHHMM() + " to " + l_forecast.get(position).getEndHHMM());
            temperature.setText(getResources().getString(R.string.temperature) + l_forecast.get(position).getTemperature() + "°C");
            wind.setText(getResources().getString(R.string.wind) + l_forecast.get(position).getWindSpeed() + "km/h");
            return row;
        }

    }
}
