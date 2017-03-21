package a1.assignment_1;

/**
 * BeerPager.java
 * Created: September 11, 2016
 * Colin FRAPPER
 */

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.os.Bundle;
import android.support.v13.app.FragmentPagerAdapter;
import android.support.v4.view.PagerAdapter;
import android.support.v4.view.ViewPager;

public class BeerPager extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.beer_pager);

        // Instantiate a ViewPager and a PagerAdapter.
        ViewPager pager = (ViewPager) findViewById(R.id.pager);
        PagerAdapter pagerAdapter = new MyPagerAdapter(getFragmentManager());
        pager.setAdapter(pagerAdapter);
    }


    private class MyPagerAdapter extends FragmentPagerAdapter {
        private Fragment[] fragments = new Fragment[7];

        public MyPagerAdapter(FragmentManager fm) {
            super(fm);

            fragments[0] = ExampleFragment.create("Beer 1 out 7", "Name: Mornin' Delight\n" +
                    "Rating: 4.7\n" +
                    "Brewery: Toppling Goliath Brewing Company, Iowa, United States\n" +
                    "Style: American Double / Imperial Stout\n" +
                    "ABV: 12.00% \n" +
                    "Review: This was my first time trying Md during the release. Prior to the release, I opened my bcbs 2014/13 and Kbs 15/12 and bcbs vr 2014 to remind myself of what goodness should be. And MD was up there with VR. The aroma/taste reminded me of slow drip coffee from single origin coffee beans blended perfect with maple syrup. The body was perfect as it had a fuller month feel than a Kbs but not as full as a VR. ", R.drawable.morning_delight);
            fragments[1] = ExampleFragment.create("Beer 2 out 7","Name: Good Morning\n" +
                    "Rating: 4.7\n" +
                    "Brewery: Tree House Brewing Company, Massachusetts, United States\n" +
                    "Style: American Double / Imperial Stout\n" +
                    "ABV: 8.40%\n" +
                    "Review: Phenomenal beer. So great. Looks like a classic imperial stout but with a rich brown, foamy head. The nose is of sweet amply syrup, with a more subtle coffee undertone. Kind of surprising given how strong of a coffee flavor their double shot has. The taste is more than expected. Definite maple, coffee, sweet and sticky. Nice think velvet body, but Sioux being syrupy. Without a doubt one of best 3 beers I've had the pleasure of trying. " ,R.drawable.goodmorning);
            fragments[2] = ExampleFragment.create("Beer 3 out 7","Name: Pliny The Younger\n" +
                    "Rating: 4.68\n" +
                    "Brewery: Russian River Brewing Company, California, United States\n" +
                    "Style: American Double / Imperial IPA\n" +
                    "ABV: 11.00%\n" +
                    "Review: Had this on opening day Feb 6, 2015 after waiting in line for 4.5 hrs in the pouring rain. It is a spectacular beer to have straight from the source. Although a very high abv it does not taste alcohol forward and is truly balanced with a good amount of hops on your tongue, a bit of grapefruit follow through and a floral scent. Had a great time drying off and warming up and 3 10oz pours along with some Elder and Blind Pig hit the spot. It is a special beer worth the effort." ,R.drawable.pliny_the_younger);
            fragments[3] = ExampleFragment.create("Beer 4 out 7","Name: Heady Topper\n" +
                    "Rating: 4.67\n" +
                    "Brewery: The Alchemist, Vermont, United States\n" +
                    "Style: American Double / Imperial IPA\n" +
                    "ABV: 8.00%\n" +
                    "Review: I was lucky enough to get some Heady Topper last week on a trip up to VT. I stood in line for two hours total at a couple of different places in Burlington and ended up with a little over a case, it was completely worth the wait. It is the most drinkable IPA I've ever tasted, very smooth, and as the can says it leaves you with \"wave after wave of hoppy goodness!\" Not to mention at 8% ABV one or two of these bad boys will leave feeling nice and hopped up. I only wish they would make more so more people could try this amazing beer!\n" ,R.drawable.heady_topper);
            fragments[4] = ExampleFragment.create("Beer 5 out 7", "Name: Kentucky Brunch Brand Stout\n" +
                    "Rating: 4.66\n" +
                    "Brewery: Toppling Goliath Brewing Company, Iowa, United States\n" +
                    "Style: American Double / Imperial Stout\n" +
                    "ABV: 12.00%\n" +
                    "Review: Pours like all TG stouts which nearly equates to motor oil. Of course the mouth feel will follow the pour which allows you to chew on the deliciousness that ensues. Scent is roasted coffee with chocolate and maple. Bit of booze in there as well. Flavor is something I've yet to find any other beer match between the coffee, maple, chocolate, molasses and balanced mouthfeel that lets you mull this beer over a bit. " ,R.drawable.kentucky_brunch_brand_stout);
            fragments[5] = ExampleFragment.create("Beer 6 out 7","Name: Pliny The Elder\n" +
                    "Rating: 4.59\n" +
                    "Style: American Double / Imperial IPA\n" +
                    "Brewery: Russian River Brewing Company, California, United StatesStyle:\n" +
                    "ABV: 8.00%\n" +
                    "Review: Poured clear amber color into a pint glass with a persistent fluffy white head. The aroma was the star of this beer: a monstrous blast of fresh hops, citric and spicy. The flavor was initially overwhelming sharp hop bitterness. This faded to a pleasant biscuity malt flavor. Medium high carbonation was almost prickly on the tongue, but helped round out the mouthfeel of a beer that could have otherwise been a touch heavy. Instead, it is an easy drinking beer that finishes clean and sweet, but short of sticky sweet, and with a hint of the citrus and spice of the hops. Overall, it is a fantastic IPA. " ,R.drawable.russian_river);
            fragments[6] = ExampleFragment.create("Beer 7 out 7","Name: Norrlands Guld Export\n" +
                    "Rating: 2.62\n" +
                    "Brewery: Spendrups Bryggeri AB, Sweden\n" +
                    "Style: Dortmunder / Export Lager\n" +
                    "ABV: 5.3%\n" +
                    "Review: Swedish beer is fun to me because I can buy it at Systembolaget and anywhere else like 7-11, the later being of lower alcohol versions of the former. I only tried the lower alcohol version of this one, as there are other better Swedish beers to get in higher alcohol. Average in all ways, not really good but not bad either. Smells a bit of corn, all in all nothing special. Nevertheless I liked this beer and it served me well. I was still able to drink much with my friends, when I had a sore throat! It was very smooth in all ways. Take it for what it is and enjoy. Just a typical beer to drink and have a good time" ,R.drawable.norrlands);
        }

        @Override
        public Fragment getItem(int position) {
            return fragments[position];
        }

        @Override
        public int getCount() {
            return fragments.length;
        }
    }


}


