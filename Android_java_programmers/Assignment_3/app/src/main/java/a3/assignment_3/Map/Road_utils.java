package a3.assignment_3.Map;

import com.google.android.gms.maps.model.LatLng;
import java.util.ArrayList;

/**
 * @author Colin FRAPPER
 * @date 24/10/2016
 */

public class Road_utils
{

    private LatLng coordinates_start;
    private LatLng coordinates_end;
    private ArrayList<LatLng> coordinates_list;


    public Road_utils()
    {
        coordinates_list = new ArrayList<>();
    }

    public void addCity(double latitude, double longitude)
    {
        coordinates_list.add(new LatLng(latitude,longitude));
    }

    public LatLng getCoordinates_start()
    {
        return coordinates_start;
    }

    public LatLng getCoordinates_end()
    {
        return coordinates_end;
    }


    public void setCoordinates_start(String latitude_city_start, String longitude_city_start)
    {
        this.coordinates_start = new LatLng(Double.parseDouble(latitude_city_start), Double.parseDouble(longitude_city_start));
    }

    public void setCoordinates_end(String latitude_city_start, String longitude_city_end)
    {
        this.coordinates_end = new LatLng(Double.parseDouble(latitude_city_start), Double.parseDouble(longitude_city_end));;
    }

    public ArrayList<LatLng> getCoordinates_list()
    {
        return coordinates_list;
    }

}
