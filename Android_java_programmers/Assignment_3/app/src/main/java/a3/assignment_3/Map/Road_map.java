package a3.assignment_3.Map;

import android.app.ActionBar;
import android.app.Activity;
import android.os.Bundle;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.PolylineOptions;

import android.content.Context;
import android.content.res.XmlResourceParser;
import android.graphics.Color;
import android.os.AsyncTask;
import android.util.Xml;
import android.view.Menu;
import android.view.MenuItem;

import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserException;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;

import a3.assignment_3.R;

public class Road_map extends Activity implements OnMapReadyCallback
{
    private GoogleMap google_map;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // creating action bar
        ActionBar ab = getActionBar();
        ab.setDisplayHomeAsUpEnabled(true);

        setContentView(R.layout.road_map);
    }

    @Override
    public void onMapReady(GoogleMap googleMap)
    {
        this.google_map = googleMap;
        googleMap.getUiSettings().setZoomControlsEnabled(true);

        DownloadURL("stocklom");
    }

    @Override
    protected void onResume()
    {
        super.onResume();
        ((MapFragment) getFragmentManager().findFragmentById(R.id.RoadMap)).getMapAsync(this);
    }

    private void DownloadURL(String city)
    {
        String urlString;
        URL url;
        switch (city)
        {
            case "odessa":
                urlString = "http://cs.lnu.se/android/VaxjoToOdessa.kml";
                break ;
            case "stockholm":
                urlString = "http://cs.lnu.se/android/VaxjoToStockholm.kml";
                break;
            default:
                urlString = "http://cs.lnu.se/android/VaxjoToCopenhagen.kml";
                break;

        }

        if(urlString != "")
        {
            try
            {
                url = new URL(urlString);
                new DownloadFileFromURL().execute(url);
            }
            catch (MalformedURLException e)
            {
                e.printStackTrace();
            }
        }
        else
        {
            System.out.println("Error during the download of the xml file");
        }

    }

    private class DownloadFileFromURL extends AsyncTask<URL, Void , File>
    {
        @Override
        protected File doInBackground(URL... param)
        {
            File road = new File(getFilesDir(), "road.xml");

            if(road.exists())
            {
                road.delete();
            }

            try
            {
                URLConnection url_connect = param[0].openConnection();
                url_connect.setUseCaches(false);
                url_connect.connect();
                InputStreamReader StreamReader = new InputStreamReader(url_connect.getInputStream());
                BufferedReader Reader = new BufferedReader(StreamReader);

                FileOutputStream readFile = openFileOutput("road.xml", Context.MODE_PRIVATE);
                String read = Reader.readLine();
                while (read != null)
                {
                    readFile.write(read.getBytes());
                    read = Reader.readLine();
                }
                readFile.close();
                Reader.close();
                StreamReader.close();
                return road;
            }
            catch (IOException e)
            {
                e.printStackTrace();
                return null;
            }
        }


        protected void onPostExecute(File result)
        {
            if (result == null)
            {
                System.out.println("Error there is no file");
                return;
            }
            List<String> coordinates = new ArrayList<>(3);
            List<String> name_city = new ArrayList<>(4);
            try
            {
                InputStream StreamReader = new FileInputStream(result);
                XmlPullParser read_xml = Xml.newPullParser();
                read_xml.setInput(StreamReader, null);
                int event = read_xml.getEventType();
                while (event != XmlResourceParser.END_DOCUMENT)
                {
                    if (event == XmlResourceParser.START_TAG)
                    {
                        if (read_xml.getName().equals("coordinates")) {
                            coordinates.add(read_xml.nextText());
                        }
                        if (read_xml.getName().equals("name")) {
                            name_city.add(read_xml.nextText());
                        }
                    }
                    event = read_xml.next();
                }
            }
            catch (XmlPullParserException | IOException e)
            {}

            Road_utils maps_road = new Road_utils();
            String coordinates_start[] = coordinates.get(1).split(",");
            String coordinates_end[] = coordinates.get(2).split(",");
            maps_road.setCoordinates_start(coordinates_start[1], coordinates_start[0]);
            maps_road.setCoordinates_end(coordinates_end[1], coordinates_end[0]);

            String group_coordinates[] = coordinates.get(0).split(" ");
            for (String way : group_coordinates)
            {
                String create_way[] = way.split(",");
                maps_road.addCity(Double.parseDouble(create_way[1]), Double.parseDouble(create_way[0]));
            }

            google_map.clear();
            google_map.addPolyline(new PolylineOptions().width(3).color(Color.BLACK).addAll(maps_road.getCoordinates_list()));

            google_map.addMarker(new MarkerOptions()
                    .position(maps_road.getCoordinates_start())
                    .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN)));

            google_map.addMarker(new MarkerOptions()
                    .position(maps_road.getCoordinates_end())
                    .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE)));

            LatLngBounds.Builder lat_lng_build = new LatLngBounds.Builder();
            for (LatLng new_lat_lng : maps_road.getCoordinates_list())
            {
                lat_lng_build.include(new_lat_lng);
            }
            LatLngBounds bounds = lat_lng_build.build();
            google_map.moveCamera(CameraUpdateFactory.newLatLngBounds(bounds, 100));
        }
    }

    public boolean onCreateOptionsMenu(Menu menu)
    {
        getMenuInflater().inflate(R.menu.road_menu, menu);
        return true;
    }

    public boolean onOptionsItemSelected(MenuItem item)
    {
        switch (item.getItemId()) {
            case R.id.RoadToOdessa:
                DownloadURL("odessa");
                return true;
            case R.id.RoadToCopenhagen:
                DownloadURL("copenhagen");
                return true;
            case R.id.RoadToStockholm:
                DownloadURL("stockholm");
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }
}