package a1.assignment_1;

/**
 * ExampleFragment.java
 * Created: September 11, 2016
 * Colin FRAPPER
 */

import android.app.Fragment;
import android.graphics.drawable.Drawable;
import android.media.Image;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;

/**
 * Created by moi on 11/09/2016.
 */
public class ExampleFragment extends Fragment
{
    final static String HEADER_TEXT = "header_text";
    final static String BODY_TEXT = "body_text";
    final static String IMAGE = "0";
    private int Image_view ;
    private ViewGroup rootView;



    public static ExampleFragment create(String header, String body, int Image) {
        ExampleFragment newFragment = new ExampleFragment();
        Bundle args = new Bundle();
        args.putString(HEADER_TEXT, header);
        args.putString(BODY_TEXT, body);
        args.putInt(IMAGE,Image);
        newFragment.setArguments(args);
        return newFragment;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        // Inflate the layout containing a header and body text.
        rootView = (ViewGroup) inflater.inflate(R.layout.example_fragment, container, false);
        return rootView;
    }

    @Override
    public void onStart() {
        super.onStart();

        String bodyText, headerText ;
        Bundle args = getArguments();
        if (args != null) {
            headerText = args.getString(HEADER_TEXT);
            bodyText = args.getString(BODY_TEXT);
            Image_view = args.getInt(IMAGE);
        }
        else {
            headerText = "Default Header";
            bodyText = "Default Body";
        }

        // Set the header and body text.
        ((TextView) rootView.findViewById(R.id.header_view)).setText(headerText);
        ((TextView) rootView.findViewById(R.id.body_view)).setText(bodyText);
        ImageView image = (ImageView) rootView.findViewById(R.id.ImageBeer);
        Drawable res = getResources().getDrawable(Image_view);
        image.setImageDrawable(res);



    }

}

