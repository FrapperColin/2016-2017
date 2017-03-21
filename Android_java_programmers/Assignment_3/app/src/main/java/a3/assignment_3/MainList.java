package a3.assignment_3;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import a3.assignment_3.IncomingCalls.*;
import a3.assignment_3.Map.*;

import android.os.Bundle;
import android.app.ListActivity;
import android.content.Intent;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.AdapterView.OnItemClickListener;

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
        setListAdapter(new ArrayAdapter<String>(this, R.layout.main_list, activities));

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
            Class<?> activity_class = name2class.get(activity_name);

			/* Start new Activity */
            Intent intent = new Intent(MainList.this, activity_class);
            MainList.this.startActivity(intent);
        }
    }

    private void setup_activities()
    {
        addActivity("IncomingCalls", Call_activity.class);
        addActivity("City map", City_map.class);
        addActivity("Road map", Road_map.class);

    }

    private void addActivity(String name, Class activity)
    {
        activities.add(name);
        name2class.put(name, activity);
    }
}
