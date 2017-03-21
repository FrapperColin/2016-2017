package a3.assignment_3.WeatherWidget;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;

import a3.assignment_3.R;

/**
 * @author Colin FRAPPER
 * @date 24/10/2016
 */

public class CityList extends Activity
{
    private final String[] cities = { "Växjö", "Paris", "Stockholm" };
    private ListView lv;
    private ArrayAdapter<String> adapt;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.city_list);

        lv = (ListView) findViewById(R.id.citylist);
        adapt = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, cities);
        lv.setAdapter(adapt);

        lv.setOnItemClickListener(new OnItemClick());
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.city_list_menu, menu);
        return true;
    }

    // starts intent with selected city
    public class OnItemClick implements AdapterView.OnItemClickListener
    {
        @Override
        public void onItemClick(AdapterView<?> arg0, View arg1, int arg2, long arg3)
        {
            String city = (String) lv.getItemAtPosition(arg2);
            Intent intent = new Intent(CityList.this, VaxjoWeather.class);
            intent.putExtra("city", city);
            startActivity(intent);
        }
    }
}

