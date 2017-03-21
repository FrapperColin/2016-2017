package a1.assignment_1;

/**
 * Random.java
 * Created: September 11, 2016
 * Colin FRAPPER
 */

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

public class Random extends AppCompatActivity 
{
    Button but ;
    TextView text ;
    protected void onCreate(Bundle savedInstanceState) 
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.random);

        text = (TextView) findViewById(R.id.texte);
        text.setText(Integer.valueOf(100).toString());

        but = (Button)findViewById(R.id.button1);

        but.setOnClickListener(new View.OnClickListener()
        {
            public void onClick(View view)
            {
                int randomNumber = (int) ((Math.random() * 100) + 1); 

                text.setText((Integer.valueOf(randomNumber)).toString());
            }
        });
    }
}
