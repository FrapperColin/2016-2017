package a2.assignment2.MyCountries;

import a2.assignment2.R;

import android.os.Bundle;
import android.preference.PreferenceFragment;


/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */
public class MyPreferenceFragment extends PreferenceFragment
{
	@Override
	public void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		addPreferencesFromResource(R.xml.prefs);
	}
}
