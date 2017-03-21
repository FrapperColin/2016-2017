package a2.assignment2.MyCountries;


import a2.assignment2.MainList;
import a2.assignment2.R;
import android.app.ActionBar;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.ContentResolver;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.content.CursorLoader;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.Loader;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.provider.CalendarContract;
import android.support.v4.widget.SimpleCursorAdapter;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ListView;
import android.widget.TextView;

/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */
public class My_countries extends Activity implements CalendarProviderClient
{

    private ListView listView;
    private SharedPreferences sp;

    private SimpleCursorAdapter adapter;
    private int ID_event;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        // creating action bar
        ActionBar ab = getActionBar();
        ab.setDisplayHomeAsUpEnabled(true);

        // getting preferences
        PreferenceManager.setDefaultValues(this, R.xml.prefs, false);
        sp = PreferenceManager.getDefaultSharedPreferences(this);

        setContentView(R.layout.my_countries);
        getMyCountriesCalendarId();

        // setting background color - preferences
         View view = findViewById(R.id.country_layout);
        loadBackgroundPreferences(view);

        listView = (ListView) findViewById(R.id.listView);
        adapter = new MyCursorAdapter(this, R.layout.list_country, null, EVENTS_LIST_PROJECTION, new int[]{R.id.year_id}, 0);
        listView.setAdapter(adapter);
        getLoaderManager().initLoader(LOADER_MANAGER_ID, null, this);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.main_countries, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item)
    {

        switch (item.getItemId())
        {
            case R.id.add_country:
                Intent intent = new Intent(this, Add_country.class);
                startActivityForResult(intent, 0);
                return true;
            case R.id.prefs:
                Intent myIntent = new Intent(this,
                        a2.assignment2.MyCountries.Preferences.class);
                this.startActivity(myIntent);
                return true;
            case R.id.menu:
                Intent intent2 = new Intent(this, MainList.class);
                startActivity(intent2);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    public static Uri asSyncAdapter(Uri uri, String account, String accountType)
    {
        return uri.buildUpon()
                .appendQueryParameter(android.provider.CalendarContract.CALLER_IS_SYNCADAPTER,"true")
                .appendQueryParameter(CalendarContract.Calendars.ACCOUNT_NAME, account)
                .appendQueryParameter(CalendarContract.Calendars.ACCOUNT_TYPE, accountType).build();
    }




    public long getMyCountriesCalendarId()
    {
        long id  ;
        Cursor cur ;
        ContentResolver cr = getContentResolver();

        cur = cr.query(CALENDARS_LIST_URI, CALENDARS_LIST_PROJECTION, CALENDARS_LIST_SELECTION, CALENDARS_LIST_SELECTION_ARGS, null);

        if(!cur.moveToFirst())
        {
            Uri uri = asSyncAdapter(CALENDARS_LIST_URI, ACCOUNT_TITLE, CalendarContract.ACCOUNT_TYPE_LOCAL);
            ContentValues values = new ContentValues();
            values.put(CalendarContract.Calendars.ACCOUNT_NAME, ACCOUNT_TITLE);
            values.put(CalendarContract.Calendars.ACCOUNT_TYPE, CalendarContract.ACCOUNT_TYPE_LOCAL);
            values.put(CalendarContract.Calendars.NAME, CALENDAR_TITLE);
            values.put(CalendarContract.Calendars.CALENDAR_DISPLAY_NAME, CALENDAR_TITLE);
            values.put(CalendarContract.Calendars.CALENDAR_ACCESS_LEVEL, CalendarContract.Calendars.CAL_ACCESS_OWNER);
            values.put(CalendarContract.Calendars.OWNER_ACCOUNT, ACCOUNT_TITLE);
            values.put(CalendarContract.Calendars.VISIBLE, 1);
            values.put(CalendarContract.Calendars.SYNC_EVENTS, 1);
            Uri res = cr.insert(uri, values);
            id = ContentUris.parseId(res);
        }
        else
        {
            id = cur.getLong(PROJ_CALENDARS_LIST_ID_INDEX);
        }
        return id ;
    }


    public void addNewEvent(int year, String country)
    {
        CalendarUtils cal = null;
        ContentResolver cr = getContentResolver();
        ContentValues values = new ContentValues();
        values.put(CalendarContract.Events.CALENDAR_ID, getMyCountriesCalendarId());
        values.put(CalendarContract.Events.DTSTART, cal.getEventStart(year));
        values.put(CalendarContract.Events.DTEND, cal.getEventEnd(year));
        values.put(CalendarContract.Events.EVENT_TIMEZONE, cal.getTimeZoneId());
        values.put(CalendarContract.Events.TITLE, country);

        Uri uri = cr.insert(EVENTS_LIST_URI, values);
        long ID_event = Long.parseLong(uri.getLastPathSegment());
        getLoaderManager().restartLoader(LOADER_MANAGER_ID, null, this);
    }


    public void updateEvent(int eventId, int year, String country)
    {
        CalendarUtils cal = null ;
        ContentResolver cr = getContentResolver();
        ContentValues values = new ContentValues();
        Uri updateUri ;
        // The new title for the event
        values.put(CalendarContract.Events.CALENDAR_ID, getMyCountriesCalendarId());
        values.put(CalendarContract.Events.DTSTART, CalendarUtils.getEventStart(year));
        values.put(CalendarContract.Events.DTEND, CalendarUtils.getEventEnd(year));
        values.put(CalendarContract.Events.EVENT_TIMEZONE, cal.getTimeZoneId());
        values.put(CalendarContract.Events.TITLE, country);
        updateUri = ContentUris.withAppendedId(EVENTS_LIST_URI, eventId);
        int rows = cr.update(updateUri, values, null, null);

        System.out.println("Row updated : " + rows);

        getLoaderManager().restartLoader(LOADER_MANAGER_ID, null, this);
    }

    public void deleteEvent(int eventId)
    {
        ContentResolver cr = getContentResolver();
        Uri deleteUri ;
        deleteUri = ContentUris.withAppendedId(EVENTS_LIST_URI, eventId);
        cr.delete(deleteUri, null, null);
        getLoaderManager().restartLoader(LOADER_MANAGER_ID, null, this);
    }

    public Loader<Cursor> onCreateLoader(int id, Bundle args)
    {
        switch (id)
        {
            case LOADER_MANAGER_ID:
                return new CursorLoader(this, EVENTS_LIST_URI, EVENTS_LIST_PROJECTION,
                        null, null, null);
            default: // Invalid ID was passed in
                return null;
        }
    }

    public void onLoadFinished(Loader<Cursor> loader, Cursor data)
    {
        switch (loader.getId())
        {
            case LOADER_MANAGER_ID:
                adapter.swapCursor(data);
                break;
        }
    }

    public void onLoaderReset(Loader<Cursor> loader)
    {
        switch (loader.getId())
        {
            case LOADER_MANAGER_ID:
                adapter.swapCursor(null);
                break;
        }
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent data)
    {
        String country ;
        int year ;

        if(resultCode == RESULT_OK)
        {
            switch (requestCode)
            {
                case 0:
                    country = data.getStringExtra("country");
                    year = data.getIntExtra("year", 0);
                    addNewEvent(year, country);
                    break;
                case 1:
                    country = data.getStringExtra("country");
                    year = data.getIntExtra("year", 0);
                    updateEvent(ID_event, year, country);
            }
        }
    }

    /*
         * Adapter to populate list with colors and integers
         */

    class MyCursorAdapter extends SimpleCursorAdapter
    {
        private Context mContext;
        private Context appContext;
        private int layout;
        private Cursor cur;
        private final LayoutInflater inflater;


        public MyCursorAdapter(Context context,int layout, Cursor c,String[] list_projection,int[] year_ID, int flags)
        {
            super(context,layout,c,list_projection,year_ID, flags);
            this.layout=layout;
            this.mContext = context;
            this.inflater=LayoutInflater.from(context);
            this.cur=c;
        }

        @Override
        public void bindView(final View view, final Context context, final Cursor cur)
        {
            super.bindView(view, context, cur);

            CalendarUtils cal = null;
            TextView country = (TextView) view.findViewById(R.id.country_id);

            TextView year = (TextView) view.findViewById(R.id.year_id);

            final int yearVal = cal.getEventYear(cur.getLong(CalendarProviderClient.PROJ_EVENTS_LIST_DTSTART_INDEX));
            final String countryVal = cur.getString(CalendarProviderClient.PROJ_EVENTS_LIST_TITLE_INDEX);
            final int id = cur.getInt(CalendarProviderClient.PROJ_EVENTS_LIST_ID_INDEX);

            year.setText(String.valueOf(yearVal));
            year.setTextSize(getSizePref());
            year.setTextColor(getFontColorPref());
            country.setText(countryVal);
            country.setTextSize(getSizePref());
            country.setTextColor(getFontColorPref());

            view.setOnClickListener(new View.OnClickListener()
            {
                @Override
                public void onClick(View v)
                {
                     AlertDialog.Builder build = new AlertDialog.Builder(context)
                            .setMessage("What do you want to do ? ")
                            .setPositiveButton("Update", new DialogInterface.OnClickListener()
                            {
                                public void onClick(DialogInterface dialog, int init1)
                                {
                                    Intent intent = new Intent(context, Update_country.class);
                                    ID_event = id;
                                    startActivityForResult(intent, 1);
                                }
                            }).setNegativeButton("Delete", new DialogInterface.OnClickListener()
                    {
                        public void onClick(DialogInterface dialog, int init1)
                        {
                            ID_event = id;
                            deleteEvent(ID_event);
                        }
                    });
                    AlertDialog alert = build.create();
                    alert.show();
                }
            });
        }
    }

    private void loadBackgroundPreferences(View view)
    {
        sp = PreferenceManager.getDefaultSharedPreferences(this);
        String backgroundColor = sp.getString(getResources().getString(R.string.prefs_back_color_key), "0");
        int colorBack = Integer.parseInt(backgroundColor);

        if (colorBack == 0)
        {
            view.setBackgroundResource(R.color.white);
        }
        else if (colorBack == 1)
        {
            view.setBackgroundResource(R.color.blue);
        }
        else if (colorBack == 2)
        {
            view.setBackgroundResource(R.color.black);
        }
        else if (colorBack == 3)
        {
            view.setBackgroundResource(R.color.green);
        }
        else if (colorBack == 4)
        {
            view.setBackgroundResource(R.color.red);
        }
        else if (colorBack == 5)
        {
            view.setBackgroundResource(R.color.yellow);
        }
    }

    @SuppressWarnings("deprecation")

    private int getFontColorPref()
    {
        sp = PreferenceManager.getDefaultSharedPreferences(this);
        String colorTextString = sp.getString(getResources().getString(R.string.prefs_text_color_key), "0");
        int colorText = Integer.parseInt(colorTextString);

        if (colorText == 1)
        {
            return getResources().getColor(R.color.white);
        }
        else if (colorText == 2)
        {
            return getResources().getColor(R.color.pink);
        }
        else if (colorText == 3)
        {
            return getResources().getColor(R.color.red);
        }
        return getResources().getColor(R.color.black);
    }

    private float getSizePref()
    {
        sp = PreferenceManager.getDefaultSharedPreferences(this);
        String textSizeString = sp.getString(getResources().getString(R.string.pres_text_size_key), "16");
        return Integer.parseInt(textSizeString);
    }

    /**
     * @role : // saving preferences before quitting app
     */

    protected void onStop()
    {
        SharedPreferences.Editor edit = sp.edit();
        edit.commit();
        edit.apply();
        super.onStop();
    }

}
