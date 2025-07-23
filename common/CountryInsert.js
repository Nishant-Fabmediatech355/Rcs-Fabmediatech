import Country from '../models/country.js'

const InsertCountry = async (req, res) => {
    try {
        const [country, created] = await Country.findOrCreate({
          where: { CountryCode: "+91" },
          defaults: { Country_name: "India", CountryCode: "+91" },
        });
        return console.log(created ? 'Country created successfully' : 'Country already exists')

    } catch (error) {
      console.log("country insert error", { error:error });
    }
}

export default InsertCountry