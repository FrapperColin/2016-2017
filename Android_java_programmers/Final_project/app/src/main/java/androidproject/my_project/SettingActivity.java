package androidproject.my_project;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;

public class SettingActivity extends AppCompatActivity {

    public static boolean sound_off ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.setting);

    }

    public void cutSound(View v)
    {
        sound_off = true ;
        Toast toast = Toast.makeText(this, "Music turn off !", Toast.LENGTH_LONG);
        toast.show();
    }

    public void activateSound(View v)
    {
        sound_off = false ;
        Toast toast = Toast.makeText(this, "Music turn on !", Toast.LENGTH_LONG);
        toast.show();
    }

    public void startPreferences(View v)
    {
        Intent myIntent = new Intent(this, Preferences.class);
        this.startActivity(myIntent);
    }
}
