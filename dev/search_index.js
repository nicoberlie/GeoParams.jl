var documenterSearchIndex = {"docs":
[{"location":"man/plotting/#Plotting","page":"Plotting","title":"Plotting","text":"","category":"section"},{"location":"man/plotting/","page":"Plotting","title":"Plotting","text":"We provide a number of plotting routines that simplify the implementation of the material parameters","category":"page"},{"location":"man/plotting/#Plot-CreepLaws","page":"Plotting","title":"Plot CreepLaws","text":"","category":"section"},{"location":"man/plotting/","page":"Plotting","title":"Plotting","text":"PlotStressStrainrate_CreepLaw","category":"page"},{"location":"man/plotting/#GeoParams.Plotting.PlotStressStrainrate_CreepLaw","page":"Plotting","title":"GeoParams.Plotting.PlotStressStrainrate_CreepLaw","text":"PlotStressStrainrate_CreepLaw(x::AbstractCreepLaw; p::CreepLawParams=nothing, Strainrate=(1e-18,1e-12), CreatePlot::Bool=false)\n\nPlots deviatoric stress versus deviatoric strain rate for a single creeplaw.      Note: if you want to create plots or use the CreatePlot=true option you need to install the Plots.jl package in julia     which is not added as a dependency here (as it is a rather large dependency).\n\nExample 1\n\njulia> x=LinearViscous()\nLinear viscosity: η=1.0e20 Pa s\njulia> Tau_II, Eps_II,  = PlotStressStrainrate_CreepLaw(x);\n\nNext you can plot this with\n\njulia> using Plots;\njulia> plot(ustrip(Eps_II),ustrip(Tau_II), xaxis=:log, yaxis=:log,xlabel=\"strain rate [1/s]\",ylabel=\"Dev. Stress [MPa]\")\n\nNote that ustrip removes the units of the arrays, as many of the plotting packages don't know how to deal with that.\n\nYou could also have done:\n\njulia> using Plots;\njulia> Tau_II, Eps_II, pl = PlotStressStrainrate_CreepLaw(x,CreatePlot=true);\n\nwhich will generate the following plot (Image: subet1)\n\nThe plot can be customized as \n\njulia> plot(pl, title=\"Linear viscosity\", linecolor=:red)\n\nSee the Plots.jl package for more options.\n\n\n\n\n\n","category":"function"},{"location":"man/nondimensionalize/#Nondimensionalization","page":"Nondimensionalization","title":"Nondimensionalization","text":"","category":"section"},{"location":"man/nondimensionalize/","page":"Nondimensionalization","title":"Nondimensionalization","text":"Create a nondimensionalization object in which we specify characteristic values, which are later employed to non-dimensionalize (or dimensionalize) all model parameters. Choose between GEO, SI or NO units:","category":"page"},{"location":"man/nondimensionalize/","page":"Nondimensionalization","title":"Nondimensionalization","text":"SI units assume all input and output is in SI units. Very general, but for typical geodynamic simulations often not so useful (as a million years has many seconds, resulting in large numbers).\nGEO units uses SI units throughout but assumes that input/output are in a format that is more convenient for typical geodynamic use cases, such as Myrs,km or MPa\nNO units are nondimensional units. Note that for parameters to be correctly non-dimensionalized in this case, you still have to indicate units (such as that velocity is given in m/s).","category":"page"},{"location":"man/nondimensionalize/","page":"Nondimensionalization","title":"Nondimensionalization","text":"A dimensional parameter can be transformed into a non-dimensional one with Nondimensionalize.","category":"page"},{"location":"man/nondimensionalize/#Specify-characteristic-values","page":"Nondimensionalization","title":"Specify characteristic values","text":"","category":"section"},{"location":"man/nondimensionalize/","page":"Nondimensionalization","title":"Nondimensionalization","text":"Characteristic values can be defined in 3 ways.","category":"page"},{"location":"man/nondimensionalize/","page":"Nondimensionalization","title":"Nondimensionalization","text":"GEO_units\nSI_units\nNO_units","category":"page"},{"location":"man/nondimensionalize/#GeoParams.Units.GEO_units","page":"Nondimensionalization","title":"GeoParams.Units.GEO_units","text":"GEO_units(;length=1000km, temperature=1000C, stress=10MPa, viscosity=1e20Pas)\n\nCreates a non-dimensionalization object using GEO units.\n\nGEO units implies that upon dimensionalization, time will be in Myrs, length in km, stress in MPa, etc. which is more convenient for typical geodynamic simulations than SI units The characteristic values given as input can be in arbitrary units (km or m), provided the unit is specified.\n\nExamples:\n\njulia> CharUnits = GEO_units()\nEmploying GEO units \nCharacteristic values: \n         length:      1000 km\n         time:        0.3169 Myrs\n         stress:      10 MPa\n         temperature: 1000.0 °C\njulia> CharUnits.velocity\n1.0e-7 m s⁻¹\n\nIf we instead have a crustal-scale simulation, it is likely more appropriate to use a different characteristic length:\n\njulia> CharUnits = GEO_units(length=10km)\nEmploying GEO units \nCharacteristic values: \n         length:      10 km\n         time:        0.3169 Myrs\n         stress:      10 MPa\n         temperature: 1000.0 °C\n\n\n\n\n\n","category":"function"},{"location":"man/nondimensionalize/#GeoParams.Units.SI_units","page":"Nondimensionalization","title":"GeoParams.Units.SI_units","text":"CharUnits = SI_units(length=1000m, temperature=1000K, stress=10Pa, viscosity=1e20)\n\nSpecify the characteristic values using SI units \n\nExamples:\n\njulia> CharUnits = SI_units(length=1000m)\nEmploying SI units \nCharacteristic values: \n         length:      1000 m\n         time:        1.0e19 s\n         stress:      10 Pa\n         temperature: 1000.0 K\n\nNote that the same can be achieved if the input is given in km:\n\njulia> CharUnits = SI_units(length=1km)\n\n\n\n\n\n","category":"function"},{"location":"man/nondimensionalize/#GeoParams.Units.NO_units","page":"Nondimensionalization","title":"GeoParams.Units.NO_units","text":"CharUnits = NO_units(length=1, temperature=1, stress=1, viscosity=1)\n\nSpecify the characteristic values in non-dimensional units\n\nExamples:\n\njulia> using GeoParams;\njulia> CharUnits = NO_units()\nEmploying NONE units \nCharacteristic values: \n         length:      1\n         time:        1.0 \n         stress:      1\n         temperature: 1.0\n\n\n\n\n\n","category":"function"},{"location":"man/nondimensionalize/#(Non)-dimensionalize-parameters","page":"Nondimensionalization","title":"(Non)-dimensionalize parameters","text":"","category":"section"},{"location":"man/nondimensionalize/","page":"Nondimensionalization","title":"Nondimensionalization","text":"Once characteristic values have been defined, you can use them to non-dimensionalize or dimensionalize any parameter.","category":"page"},{"location":"man/nondimensionalize/","page":"Nondimensionalization","title":"Nondimensionalization","text":"Nondimensionalize!\nDimensionalize!\nNondimensionalize\nDimensionalize\nisDimensional","category":"page"},{"location":"man/nondimensionalize/#GeoParams.Units.Nondimensionalize!","page":"Nondimensionalization","title":"GeoParams.Units.Nondimensionalize!","text":"Nondimensionalize!(param::GeoUnit, CharUnits::GeoUnits{TYPE})\n\nNondimensionalizes param (given as GeoUnit) using the characteristic values specified in CharUnits in-place\n\nExample 1\n\njulia> using GeoParams;\njulia> CharUnits =   GEO_units();\njulia> v         =   GeoUnit(3cm/yr)\n3 cm yr⁻¹ \njulia> Nondimensionalize!(v, CharUnits) \n0.009506426344208684\n\nExample 2\n\njulia> CharUnits =   GEO_units();\njulia> A         =   GeoUnit(6.3e-2MPa^-3.05*s^-1)\n0.063 MPa⁻³·⁰⁵ s⁻¹\njulia> A_ND      =   Nondimensionalize(A, CharUnits) \n7.068716262102384e14\n\n\n\n\n\nNondimensionalize!(MatParam::AbstractMaterialParam, CharUnits::GeoUnits{TYPE})\n\nNon-dimensionalizes a material parameter structure (e.g., Density, CreepLaw)\n\n\n\n\n\nNondimensionalize!(phase_mat::MaterialParams, g::GeoUnits{TYPE})\n\nNondimensionalizes all fields within the Material Parameters structure that contain material parameters\n\n\n\n\n\n","category":"function"},{"location":"man/nondimensionalize/#GeoParams.Units.Dimensionalize!","page":"Nondimensionalization","title":"GeoParams.Units.Dimensionalize!","text":"Dimensionalize!(param::GeoUnit, CharUnits::GeoUnits{TYPE})\n\nDimensionalizes param again to the values that it used to have using the characteristic values specified in CharUnits.  \n\nExample\n\njulia> CharUnits =   GEO_units();\njulia> x = GeoUnit(3cm/yr)\njulia> Nondimensionalize!(x, CharUnits)\njulia> Dimensionalize!(x, CharUnits) \n3.0 cm yr⁻¹\n\n\n\n\n\nDimensionalize!(MatParam::AbstractMaterialParam, CharUnits::GeoUnits{TYPE})\n\nDimensionalizes a material parameter structure (e.g., Density, CreepLaw)\n\n\n\n\n\nDimensionalize!(phase_mat::MaterialParams, g::GeoUnits{TYPE})\n\nDimensionalizes all fields within the Material Parameters structure that contain material parameters\n\n\n\n\n\n","category":"function"},{"location":"man/nondimensionalize/#GeoParams.Units.Nondimensionalize","page":"Nondimensionalization","title":"GeoParams.Units.Nondimensionalize","text":"Nondimensionalize(param, CharUnits::GeoUnits{TYPE})\n\nNondimensionalizes param using the characteristic values specified in CharUnits\n\nExample 1\n\njulia> using GeoParams;\njulia> CharUnits =   GEO_units();\njulia> v         =   3cm/yr\n3 cm yr⁻¹ \njulia> v_ND      =   Nondimensionalize(v, CharUnits) \n0.009506426344208684\n\nExample 2\n\nIn geodynamics one sometimes encounters more funky units\n\njulia> CharUnits =   GEO_units();\njulia> A         =   6.3e-2MPa^-3.05*s^-1\n0.063 MPa⁻³·⁰⁵ s⁻¹\njulia> A_ND      =   Nondimensionalize(A, CharUnits) \n7.068716262102384e14\n\nIn case you are interested to see how the units of A look like in different units, use this function from the Unitful package:\n\njulia> uconvert(u\"Pa^-3.05*s^-1\",A) \n3.157479571851836e-20 Pa⁻³·⁰⁵\n\nand to see it decomposed in the basic SI units of length, mass and time:\n\njulia> upreferred(A)\n3.1574795718518295e-20 m³·⁰⁵ s⁵·¹ kg⁻³·⁰⁵\n\n\n\n\n\n","category":"function"},{"location":"man/nondimensionalize/#GeoParams.Units.Dimensionalize","page":"Nondimensionalization","title":"GeoParams.Units.Dimensionalize","text":"Dimensionalize(param, param_dim::Unitful.FreeUnits, CharUnits::GeoUnits{TYPE})\n\nDimensionalizes param into the dimensions param_dim using the characteristic values specified in CharUnits.  \n\nExample\n\njulia> CharUnits =   GEO_units();\njulia> v_ND      =   Nondimensionalize(3cm/yr, CharUnits) \n0.031688087814028945\njulia> v_dim     =   Dimensionalize(v_ND, cm/yr, CharUnits) \n3.0 cm yr⁻¹\n\n\n\n\n\n","category":"function"},{"location":"man/nondimensionalize/#GeoParams.Units.isDimensional","page":"Nondimensionalization","title":"GeoParams.Units.isDimensional","text":"isDimensional(MatParam::AbstractMaterialParam)\n\ntrue if MatParam is in dimensional units.    \n\n\n\n\n\n","category":"function"},{"location":"man/materialparameters/#MaterialParameters","page":"Material Parameters","title":"MaterialParameters","text":"","category":"section"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"Material properties for a given phase can be set with SetMaterialParams, whereas all properties are  store in the MaterialParams structure.","category":"page"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"SetMaterialParams\nMaterialParams","category":"page"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.SetMaterialParams","page":"Material Parameters","title":"GeoParams.MaterialParameters.SetMaterialParams","text":"SetMaterialParams(; Name::String=\"\", Phase::Int64=1,\n                    Density             =   nothing, \n                    Gravity             =   nothing,\n                    CreepLaws           =   nothing, \n                    Elasticity          =   nothing, \n                    Plasticity          =   nothing, \n                    Conductivity        =   nothing, \n                    HeatCapacity        =   nothing, \n                    EnergySourceTerms   =   nothing, \n                    CharDim::GeoUnits   =   nothing)\n\nSets material parameters for a given phase. \n\nIf CharDim is specified the input parameters are non-dimensionalized.   Note that if Density is specified, we also set Gravity even if not explicitly listed\n\nExamples\n\nDefine two viscous creep laws & constant density:\n\njulia> Phase = SetMaterialParams(Name=\"Viscous Matrix\",\n                       Density   = ConstantDensity(),\n                       CreepLaws = (PowerlawViscous(), LinearViscous(η=1e21Pa*s)))\nPhase 1 : Viscous Matrix\n        | [dimensional units]\n        | \n        |-- Density           : Constant density: ρ=2900 kg m⁻³ \n        |-- Gravity           : Gravitational acceleration: g=9.81 m s⁻² \n        |-- CreepLaws         : Powerlaw viscosity: η0=1.0e18 Pa s, n=2.0, ε0=1.0e-15 s⁻¹  \n        |                       Linear viscosity: η=1.0e21 Pa s\n\nDefine two viscous creep laws & P/T dependent density and nondimensionalize\n\njulia> CharUnits_GEO   =   GEO_units(viscosity=1e19, length=1000km);\njulia> Phase = SetMaterialParams(Name=\"Viscous Matrix\", Phase=33,\n                              Density   = PT_Density(),\n                              CreepLaws = (PowerlawViscous(n=3), LinearViscous(η=1e23Pa*s)),\n                              CharDim   = CharUnits_GEO)\nPhase 33: Viscous Matrix\n        | [non-dimensional units]\n        | \n        |-- Density           : P/T-dependent density: ρ0=2.9e-16, α=0.038194500000000006, β=0.01, T0=0.21454659702313156, P0=0.0 \n        |-- Gravity           : Gravitational acceleration: g=9.810000000000002e18 \n        |-- CreepLaws         : Powerlaw viscosity: η0=0.1, n=3, ε0=0.001  \n        |                       Linear viscosity: η=10000.0 \n\nYou can also create an array that holds several parameters:\n\njulia> MatParam        =   Array{MaterialParams, 1}(undef, 2);\njulia> Phase           =   1;\njulia> MatParam[Phase] =   SetMaterialParams(Name=\"Upper Crust\", Phase=Phase,\n                            CreepLaws= (PowerlawViscous(), LinearViscous(η=1e23Pa*s)),\n                            Density  = ConstantDensity(ρ=2900kg/m^3));\njulia> Phase           =   2;\njulia> MatParam[Phase] =   SetMaterialParams(Name=\"Lower Crust\", Phase=Phase,\n                            CreepLaws= (PowerlawViscous(n=5), LinearViscous(η=1e21Pa*s)),\n                            Density  = PT_Density(ρ0=3000kg/m^3));\njulia> MatParam\n2-element Vector{MaterialParams}:\n Phase 1 : Upper Crust\n    | [dimensional units]\n    | \n    |-- Density           : Constant density: ρ=2900 kg m⁻³ \n    |-- Gravity           : Gravitational acceleration: g=9.81 m s⁻² \n    |-- CreepLaws         : Powerlaw viscosity: η0=1.0e18 Pa s, n=2.0, ε0=1.0e-15 s⁻¹  \n    |                       Linear viscosity: η=1.0e23 Pa s \n                            \n Phase 2 : Lower Crust\n    | [dimensional units]\n    | \n    |-- Density           : P/T-dependent density: ρ0=3000 kg m⁻³, α=3.0e-5 K⁻¹, β=1.0e-9 Pa⁻¹, T0=0 °C, P0=0 MPa \n    |-- Gravity           : Gravitational acceleration: g=9.81 m s⁻² \n    |-- CreepLaws         : Powerlaw viscosity: η0=1.0e18 Pa s, n=5, ε0=1.0e-15 s⁻¹  \n    |                       Linear viscosity: η=1.0e21 Pa s \n\n\n\n\n\n","category":"function"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.MaterialParams","page":"Material Parameters","title":"GeoParams.MaterialParameters.MaterialParams","text":"MaterialParams\n\nStructure that holds all material parameters for a given phase\n\n\n\n\n\n","category":"type"},{"location":"man/materialparameters/#CreepLaws","page":"Material Parameters","title":"CreepLaws","text":"","category":"section"},{"location":"man/materialparameters/#Implemented-creep-laws","page":"Material Parameters","title":"Implemented creep laws","text":"","category":"section"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"The following viscous creep laws are implemented:","category":"page"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"GeoParams.MaterialParameters.CreepLaw.LinearViscous\nGeoParams.MaterialParameters.CreepLaw.PowerlawViscous","category":"page"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.CreepLaw.LinearViscous","page":"Material Parameters","title":"GeoParams.MaterialParameters.CreepLaw.LinearViscous","text":"LinearViscous(η=1e20Pa*s)\n\nDefines a linear viscous creeplaw \n\nThe (isotopic) linear viscous rheology is given by  \n\n    tau_ij = 2 eta dotvarepsilon_ij \n\nor\n\n    dotvarepsilon_ij  = tau_ij  over 2 eta \n\nwhere eta_0 is the reference viscosity [Pa*s] at reference strain rate dotvarepsilon_0[1/s], and n the power law exponent []. \n\n\n\n\n\n","category":"type"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.CreepLaw.PowerlawViscous","page":"Material Parameters","title":"GeoParams.MaterialParameters.CreepLaw.PowerlawViscous","text":"PowerlawViscous(η0=1e18Pa*s, n=2.0NoUnits, ε0=1e-15/s)\n\nDefines a power law viscous creeplaw as: \n\n    tau_ij^n  = 2 eta_0 left( dotvarepsilon_ij over dotvarepsilon_0 right)\n\nwhere eta is the effective viscosity [Pa*s].\n\n\n\n\n\n","category":"type"},{"location":"man/materialparameters/#Computational-routines-for-creep-laws","page":"Material Parameters","title":"Computational routines for creep laws","text":"","category":"section"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"Once a creep rheology is defined, we can use the following routines to perform computations within the solvers","category":"page"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"CreepLawParams\nGeoParams.MaterialParameters.CreepLaw.ComputeCreepLaw_EpsII\nGeoParams.MaterialParameters.CreepLaw.ComputeCreepLaw_TauII","category":"page"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.CreepLaw.ComputeCreepLaw_EpsII","page":"Material Parameters","title":"GeoParams.MaterialParameters.CreepLaw.ComputeCreepLaw_EpsII","text":"ComputeCreepLaw_EpsII(TauII, s:<AbstractCreepLaw, p::CreepLawVariables)\n\nReturns the strainrate invariant dotvarepsilon_II for a given deviatoric stress  invariant tau_II for any of the viscous creep laws implemented. p is a struct that can hold various parameters (such as P, T) that the creep law may need for the calculations \n\n    dotvarepsilon_II   = f( tau_II ) \n\n\n\n\n\n","category":"function"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.CreepLaw.ComputeCreepLaw_TauII","page":"Material Parameters","title":"GeoParams.MaterialParameters.CreepLaw.ComputeCreepLaw_TauII","text":"ComputeCreepLaw_TauII(EpsII, s:<AbstractCreepLaw, p::CreepLawVariables)\n\nReturns the deviatoric stress invariant tau_II for a given strain rate   invariant dotvarepsilon_II for any of the viscous creep laws implemented. p is a struct that can hold various parameters (such as P, T) that the creep law may need for the calculations \n\n    tau_II  = f( dotvarepsilon_II ) \n\n\n\n\n\n","category":"function"},{"location":"man/materialparameters/#Density","page":"Material Parameters","title":"Density","text":"","category":"section"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"The density equation of state can be specified in a number of ways","category":"page"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"GeoParams.MaterialParameters.Density.ConstantDensity\nGeoParams.MaterialParameters.Density.PT_Density","category":"page"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.Density.ConstantDensity","page":"Material Parameters","title":"GeoParams.MaterialParameters.Density.ConstantDensity","text":"ConstantDensity(ρ=2900kg/m^3)\n\nSet a constant density:\n\n    rho  = cst\n\nwhere rho is the density [kgm^3].\n\n\n\n\n\n","category":"type"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.Density.PT_Density","page":"Material Parameters","title":"GeoParams.MaterialParameters.Density.PT_Density","text":"PT_Density(ρ0=2900kg/m^3, α=3e-5/K, β=1e-9/Pa, T0=0C, P=0MPa)\n\nSet a pressure and temperature-dependent density:\n\n    rho  = rho_0 (10 - alpha (T-T_0) + beta  (P-P_0) )  \n\nwhere rho_0 is the density [kgm^3] at reference temperature T_0 and pressure P_0, alpha is the temperature dependence of density and beta the pressure dependence.\n\n\n\n\n\n","category":"type"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"To evaluate density within a user routine, use this:","category":"page"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"GeoParams.MaterialParameters.Density.ComputeDensity","category":"page"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.Density.ComputeDensity","page":"Material Parameters","title":"GeoParams.MaterialParameters.Density.ComputeDensity","text":"ComputeDensity(P,T, s:<AbstractDensity)\n\nReturns the density ρ at a given pressure and temperature using any  of the density EoS implemented.\n\n\n\n\n\n","category":"function"},{"location":"man/materialparameters/#Gravitational-acceleration","page":"Material Parameters","title":"Gravitational acceleration","text":"","category":"section"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"Gravitational acceleration is defined as ","category":"page"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"GeoParams.MaterialParameters.GravitationalAcceleration.ConstantGravity","category":"page"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.GravitationalAcceleration.ConstantGravity","page":"Material Parameters","title":"GeoParams.MaterialParameters.GravitationalAcceleration.ConstantGravity","text":"GravityConstant(g=9.81m/s^2)\n\nSet a constant value for the gravitational acceleration:\n\n    g  = 981 m s^-2\n\n\n\n\n\n","category":"type"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"To compute, use this:","category":"page"},{"location":"man/materialparameters/","page":"Material Parameters","title":"Material Parameters","text":"GeoParams.MaterialParameters.GravitationalAcceleration.ComputeGravity","category":"page"},{"location":"man/materialparameters/#GeoParams.MaterialParameters.GravitationalAcceleration.ComputeGravity","page":"Material Parameters","title":"GeoParams.MaterialParameters.GravitationalAcceleration.ComputeGravity","text":"ComputeGravity(s:<AbstractGravity)\n\nReturns the gravitational acceleration \n\n\n\n\n\n","category":"function"},{"location":"man/contributing/#Contributing","page":"Contributing","title":"Contributing","text":"","category":"section"},{"location":"man/contributing/","page":"Contributing","title":"Contributing","text":"This page details the some of the guidelines that should be followed when contributing to this package.","category":"page"},{"location":"man/contributing/","page":"Contributing","title":"Contributing","text":"You can contribute for example by adding new creep laws or by adding new constitutive relationships. If you invest a bit of time now, it will save others in the community a lot of time! The simplest way to do this is by cloning the repository, and creating a new branch for your feature. Once you are happy with what you added (and after you added a test to ensure that it will keep working with future changes), create a pull request and we will evaluate & merge it.","category":"page"},{"location":"man/contributing/#Style-Guide","page":"Contributing","title":"Style Guide","text":"","category":"section"},{"location":"man/contributing/","page":"Contributing","title":"Contributing","text":"Follow the style of the surrounding text when making changes. When adding new features please try to stick to the following points whenever applicable.","category":"page"},{"location":"man/contributing/#Julia","page":"Contributing","title":"Julia","text":"","category":"section"},{"location":"man/contributing/","page":"Contributing","title":"Contributing","text":"4-space indentation;\nmodules spanning entire files should not be indented, but modules that have surrounding code should;\nno blank lines at the start or end of files;\ndo not manually align syntax such as = or :: over adjacent lines;\nuse function ... end when a method definition contains more than one toplevel expression;\nrelated short-form method definitions don't need a new line between them;\nunrelated or long-form method definitions must have a blank line separating each one;\nsurround all binary operators with whitespace except for ::, ^, and :;\nfiles containing a single module ... end must be named after the module;\nmethod arguments should be ordered based on the amount of usage within the method body;\nmethods extended from other modules must follow their inherited argument order, not the above rule;\nexplicit return should be preferred except in short-form method definitions;\navoid dense expressions where possible e.g. prefer nested ifs over complex nested ?s;\ninclude a trailing , in vectors, tuples, or method calls that span several lines;\ndo not use multiline comments (#= and =#);\nwrap long lines as near to 92 characters as possible, this includes docstrings;\nfollow the standard naming conventions used in Base.","category":"page"},{"location":"man/contributing/#Markdown","page":"Contributing","title":"Markdown","text":"","category":"section"},{"location":"man/contributing/","page":"Contributing","title":"Contributing","text":"Use unbalanced # headers, i.e. no # on the right hand side of the header text;\ninclude a single blank line between toplevel blocks;\nunordered lists must use * bullets with two preceding spaces;\ndo not hard wrap lines;\nuse emphasis (*) and bold (**) sparingly;\nalways use fenced code blocks instead of indented blocks;\nfollow the conventions outlined in the Julia documentation page on documentation.","category":"page"},{"location":"man/listfunctions/#List-of-all-functions","page":"List of functions","title":"List of all functions","text":"","category":"section"},{"location":"man/listfunctions/","page":"List of functions","title":"List of functions","text":"This page details the some of the guidelines that should be followed when contributing to this package.","category":"page"},{"location":"man/listfunctions/","page":"List of functions","title":"List of functions","text":"","category":"page"},{"location":"#GeoParams.jl","page":"Home","title":"GeoParams.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"Typical geodynamic simulations involve a large number of material parameters that have units that are often inconvenient to be directly used in numerical models. This package has two main features that help with this:","category":"page"},{"location":"","page":"Home","title":"Home","text":"Nondimensionalization object, which can be used to transfer dimensional to non-dimensional parameters (usually better for numerical solvers).\nMaterial parameters object in which you can specify  parameters employed in the geodynamic simulations. This object is designed to be extensible and can be passed on to the solvers, such that new creep laws or features can be readily added. ","category":"page"},{"location":"","page":"Home","title":"Home","text":"We also implement some typically used creep law parameters, together with tools to plot them versus and compare our results with those of published papers (to minimize mistakes).","category":"page"}]
}
