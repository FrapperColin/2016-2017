package a1.assignment_1;

/**
 * My_countries.java
 * Created: September 11, 2016
 * Colin FRAPPER
 */

import android.content.Context;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

public class My_countries extends AppCompatActivity {

    static final int NUMBER = 1;
    private String country;
    private String year;
    private ListView listView;
    private MyAdapter adapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.my_countries);

        listView = (ListView) findViewById(R.id.listView);
        adapter = new MyAdapter(this, R.layout.list_country);

    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        super.onCreateOptionsMenu(menu);
        MenuInflater inflater = getMenuInflater();
        //R.menu.menu est l'id de notre menu
        inflater.inflate(R.menu.action_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        Intent intent = new Intent(this, Add_country.class);
        startActivityForResult(intent, NUMBER);
        return true;
    }


    protected void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode == NUMBER) {

            if (resultCode == RESULT_OK) {
                country = data.getStringExtra("country");
                year = data.getStringExtra("year");
                adapter.add(year + "           " + country);
                listView.setAdapter(adapter);   // Forces ListView update
                adapter.notifyDataSetChanged();


            }
        }
    }

    /*
         * Adapter to populate list with colors and integers
         */
    class MyAdapter extends ArrayAdapter<Object> {

        public MyAdapter(Context context, int textViewResourceId) {
            super(context, textViewResourceId);
        }

        @Override   // Called when updating the ListView
        public View getView(int position, View convertView, ViewGroup parent) {
        		/* Reuse super handling ==> A TextView from R.layout.list_item */
            TextView tv = (TextView) super.getView(position, convertView, parent);

        		/* Find corresponding entry */
            Object obj = getItem(position);
            tv.setText(obj.toString());
            return tv;
        }
    }
}