package a2.assignment2.MyCountries;

import android.app.ActionBar;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import a2.assignment2.MainList;
import a2.assignment2.R;

/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class Update_country extends Activity
{

    private EditText AnswerCountry;
    private EditText AnswerYear;
    private Button Button_send;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);

        // creating action bar
        ActionBar ab = getActionBar();
        ab.setDisplayHomeAsUpEnabled(true);

        setContentView(R.layout.update_country);
        AnswerCountry = (EditText) findViewById(R.id.edit_country);
        AnswerYear = (EditText) findViewById(R.id.edit_year);
        Button_send = (Button) findViewById(R.id.button_done);

        Button_send.setOnClickListener(ClickListenerCompute);

    }

    public boolean onCreateOptionsMenu(Menu menu)
    {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.update_country_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item)
    {
        switch (item.getItemId())
        {
            case R.id.menu:
                Intent intent2 = new Intent(this, MainList.class);
                startActivity(intent2);
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private View.OnClickListener ClickListenerCompute = new View.OnClickListener()
    {
        public void onClick(View v)
        {
            String Country = AnswerCountry.getText().toString();
            String Year = AnswerYear.getText().toString();

            if (TextUtils.isEmpty(Country) || TextUtils.isDigitsOnly(Country))
            {
                AnswerCountry.setError("Please enter the country and don't use number");
                return;
            }
            if (TextUtils.isEmpty(Year) || !TextUtils.isDigitsOnly(Year) || Integer.valueOf(Year) < 1920 || Integer.valueOf(Year) > 2017)
            {
                AnswerYear.setError("Please enter the year and don't use characters");
                return;
            }

            int year = 0;
            try
            {
                year = Integer.parseInt(Year);

            }
            catch (NumberFormatException e)
            {
                System.out.println("ERROR");
            }
            Intent result = new Intent();
            result.putExtra("year", year);
            result.putExtra("country", Country);
            setResult(RESULT_OK, result);
            finish();
        }
    };
}
