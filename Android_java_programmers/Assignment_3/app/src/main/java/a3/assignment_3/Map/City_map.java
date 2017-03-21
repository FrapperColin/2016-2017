package a3.assignment_3.Map;

import android.app.ActionBar;
import android.app.Activity;
import android.location.Location;
import android.os.Bundle;
import android.widget.Toast;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;


import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.HashMap;

import a3.assignment_3.R;

/**
 * @author Colin FRAPPER
 * @date 24/10/2016
 */

public class City_map extends Activity implements OnMapReadyCallback
{

    private ArrayList<String> Cities = new ArrayList<>();
    private HashMap<String, String> City_mark = new HashMap<>();
    private Toast distance;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        ActionBar ab = getActionBar();
        ab.setDisplayHomeAsUpEnabled(true);

        setContentView(R.layout.city_map);
        try
        {
            Cities = getCities();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    private ArrayList<String> getCities() throws IOException
    {
        ArrayList<String> cities = new ArrayList<>();
        InputStream openFileCity = getResources().openRawResource(R.raw.city_map);
        BufferedReader Reader = new BufferedReader(new InputStreamReader(openFileCity));
        String line;
        while(true)
        {
            line = Reader.readLine();
            if(line != null)
            {
                cities.add(line);
            }
            else
            {
                break;
            }
        }
        return cities;
    }

    protected void onResume()
    {
        super.onResume();
        ((MapFragment) getFragmentManager().findFragmentById(R.id.map_view)).getMapAsync(this);
    }

    @Override
    public void onMapReady(final GoogleMap map_google)
    {
        map_google.getUiSettings().setZoomControlsEnabled(true);
        final ArrayList<Marker> marks = new ArrayList<>();

        for(String city : Cities)
        {
            String[] coordinates = city.split("/");
            Marker mark = map_google.addMarker(new MarkerOptions().position(new LatLng( Double.valueOf(coordinates[1]), Double.valueOf(coordinates[2]))));
            City_mark.put(mark.getId(),coordinates[0]);
            marks.add(mark);
        }

        map_google.setOnMapLoadedCallback(new GoogleMap.OnMapLoadedCallback()
        {
            public void onMapLoaded()
            {
                LatLngBounds.Builder lat_lng_build = new LatLngBounds.Builder();
                for (Marker mark : marks)
                {
                    lat_lng_build.include(mark.getPosition());
                }
                LatLngBounds new_lat_lng = lat_lng_build.build();
                map_google.moveCamera(CameraUpdateFactory.newLatLngBounds(new_lat_lng,100));
            }
        });

        map_google.setOnCameraMoveStartedListener(new GoogleMap.OnCameraMoveStartedListener()
        {
            public void onCameraMoveStarted(int i)
            {
                String city_position = "";
                float way_position = Integer.MAX_VALUE;
                float distances[] = new float[1];
                LatLng Latitude_longitude =   map_google.getCameraPosition().target;;
                double Latitude = Latitude_longitude.latitude;
                double Longitude = Latitude_longitude.longitude;

                for(String city : Cities)
                {
                    String[] cityAtt =  city.split("/");
                    Location.distanceBetween(Latitude,Longitude, Double.valueOf(cityAtt[1]), Double.valueOf(cityAtt[2]), distances);
                    if(distances[0] < way_position)
                    {
                        way_position = distances[0];
                        city_position = cityAtt[0];
                    }
                }

                way_position = way_position / 1000;
                DecimalFormat decimalFormat = new DecimalFormat("0.###");
                String formatage = decimalFormat.format(way_position);

                way_position = Float.valueOf(formatage);

                if (distance != null)
                {
                    distance.cancel();
                }
                distance = Toast.makeText(City_map.this, "The most closest city is " + city_position + " at  " + way_position + "kilometers", Toast.LENGTH_SHORT);
                distance.show();
            }
        });
    }
}
