package a3.assignment_3.WeatherWidget;

import android.app.ActionBar;
import android.app.ListActivity;
import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.provider.Settings;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;

import a3.assignment_3.R;

/**
 * @author Colin FRAPPER
 * @date 24/10/2016
 */

public class VaxjoWeather extends ListActivity
{
    private WeatherReport report = null;
    private ListView list_view = null;
    private ArrayList<WeatherForecast> List_forecast = new ArrayList<WeatherForecast>();
    private Context cont = this;
    private ListAdapter adapt = null;
    private URL url;

    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        ActionBar ab = getActionBar();
        ab.setDisplayHomeAsUpEnabled(true);

        Intent intent = getIntent();
        String city = intent.getStringExtra("city");

        if (city.equalsIgnoreCase("Växjö"))
        {
            try
            {
                url = new URL("http://www.yr.no/sted/Sverige/Kronoberg/V%E4xj%F6/forecast.xml");
            }
            catch (IOException ioe)
            {
                ioe.printStackTrace();
            }
        }
        else if (city.equalsIgnoreCase("Stockholm"))
        {
            try
            {
                url = new URL("http://www.yr.no/place/Sweden/Stockholm/Stockholm/forecast.xml");
            }
            catch (IOException ioe)
            {
                ioe.printStackTrace();
            }

        }
        else if (city.equalsIgnoreCase("Paris"))
        {
            try
            {
                url = new URL("http://www.yr.no/place/France/%C3%8Ele-de-France/Paris/forecast.xml");
            }
            catch (IOException ioe)
            {
                ioe.printStackTrace();
            }
        }

        if (!ModeOn(getApplicationContext()))
        {
            new WeatherRetriever().execute(url);
            setContentView(R.layout.vaxjo_weather);
            list_view = (ListView) findViewById(android.R.id.list);
            adapt = new MyAdapter(this);

        }
        else
        {
            String text = getResources().getString(R.string.Internet);
            Toast toast = Toast.makeText(cont, text, Toast.LENGTH_LONG);
            toast.show();
        }
    }

    @SuppressWarnings("deprecation")
    private static boolean ModeOn(Context cont)
    {
        return Settings.System.getInt(cont.getContentResolver(),
                Settings.System.AIRPLANE_MODE_ON, 0) != 0;
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

        protected void onProgressUpdate(Void... progress) {

        }

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
            }
            else
            {
                String text = "Sorry, we didn't found weather report";
                Toast toast = Toast.makeText(cont, text, Toast.LENGTH_LONG);
                toast.show();
            }
        }
    }

    class MyAdapter extends BaseAdapter implements ListAdapter
    {
        Context cont;
        ArrayList<WeatherForecast> l_forecast;

        public MyAdapter(Context cont)
        {
            this.cont = cont;
            this.l_forecast = List_forecast;
        }

        public int getCount()
        {
            return l_forecast.size();
        }

        public Object getItem(int position)
        {
            return l_forecast.get(position);
        }

        public long getItemId(int position)
        {
            return 0;
        }

        // Called when updating the ListView
        public View getView(int position, View convertView, ViewGroup parent)
        {
            View row;
            if (convertView == null)
            {
                LayoutInflater inflater = getLayoutInflater();
                row = inflater.inflate(R.layout.row_vaxjo_weather, parent, false);
            }
            else
            {
                row = convertView;
            }

            ImageView image = (ImageView) row.findViewById(R.id.Image_weather);
            int ResImages = 0;

            switch (l_forecast.get(position).getWeatherCode()) {
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

            @SuppressWarnings("deprecation")
            Drawable res = getResources().getDrawable(ResImages);
            image.setImageDrawable(res);

            TextView date_start = (TextView) row.findViewById(R.id.Date_start);
            TextView time_start = (TextView) row.findViewById(R.id.Time_start);
            TextView temperature = (TextView) row.findViewById(R.id.temperature_weather);
            TextView wind = (TextView) row.findViewById(R.id.wind);

            date_start.setText(l_forecast.get(position).getStartYYMMDD().toString() + " to " + l_forecast.get(position).getEndYYMMDD().toString());
            time_start.setText(l_forecast.get(position).getStartHHMM() + " to " + l_forecast.get(position).getEndHHMM());
            temperature.setText(getResources().getString(R.string.temperature) + l_forecast.get(position).getTemp() + "°C");
            wind.setText(getResources().getString(R.string.wind) + l_forecast.get(position).getWindSpeed() + "km/h");
            return row;
        }

    }
}