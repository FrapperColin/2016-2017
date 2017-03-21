package a2.assignment2.MyCountries;

import java.util.List;
import a2.assignment2.R;
import android.preference.PreferenceActivity;

/**
 * @author Colin FRAPPER
 * @date 24/09/2016
 */

public class Preferences extends PreferenceActivity
{

	@Override
	public void onBuildHeaders(List<Header> target)
	{
		loadHeadersFromResource(R.xml.preference_headers, target);
	}

	protected boolean isValidFragment(String fragmentName)
	{
		return MyPreferenceFragment.class.getName().equals(fragmentName);
	}
}