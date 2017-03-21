package androidproject.my_project;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;

public class startActivity extends AppCompatActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.start);

    }

    public void startGame(View v )
    {
        Intent intent = new Intent(getApplicationContext(), MainActivity.class);
        startActivity(intent);
    }

    public void startSetting(View v)
    {
        Intent intent = new Intent(getApplicationContext(), SettingActivity.class);
        startActivity(intent);
    }

/*
    // Disable return action
    public boolean dispatchKeyEvent(KeyEvent e)
    {
        if(e.getAction() == KeyEvent.ACTION_DOWN)
        {
            switch(e.getKeyCode())
            {
                case KeyEvent.KEYCODE_BACK:
                    return true ;
            }
        }
        return super.dispatchKeyEvent(e);
    }
    */
}
