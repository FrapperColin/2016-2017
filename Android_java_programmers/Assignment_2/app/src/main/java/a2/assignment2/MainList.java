package a2.assignment2;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import android.os.Bundle;
import android.app.ListActivity;
import android.content.Intent;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.AdapterView.OnItemClickListener;

import a2.assignment2.AlarmClock.Main_app_alarm;
import a2.assignment2.MediaPlayer.MP3Player;
import a2.assignment2.MyCountries.My_countries;

/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class MainList extends ListActivity
{

    private List<String> activities = new ArrayList<String>();
    private Map<String, Class> name2class = new HashMap<String, Class>();

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

		/* Add Activities to list */
        setup_activities();
        setListAdapter(new ArrayAdapter<String>(this, R.layout.main_list_item, activities));

		/* Attach list item listener */
        ListView lv = getListView();
        lv.setOnItemClickListener(new OnItemClick());
    }

    /* Private Help Entities */
    private class OnItemClick implements OnItemClickListener
    {
        @Override
        public void onItemClick(AdapterView<?> parent, View view, int position, long id)
        {
			/* Find selected activity */
            String activity_name = activities.get(position);
            Class activity_class = name2class.get(activity_name);

			/* Start new Activity */
            Intent intent = new Intent(MainList.this, activity_class);
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
            intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
            MainList.this.startActivity(intent);
        }
    }

    private void setup_activities()
    {
        addActivity("Mp3 Player", MP3Player.class);
        addActivity("Alarm Clock", Main_app_alarm.class);
        addActivity("My Countries", My_countries.class);
    }

    private void addActivity(String name, Class activity)
    {
        activities.add(name);
        name2class.put(name, activity);
    }

}
