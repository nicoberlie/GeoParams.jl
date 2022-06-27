module SeismicVelocity

# This implements different methods to compute seismic velocities 
#
# If you want to add a new method here, feel free to do so. 
# Remember to also export the function name in GeoParams.jl (in addition to here)


using Parameters, LaTeXStrings, Unitful
using ..Units
using ..PhaseDiagrams
using ..MaterialParameters: MaterialParamsInfo
using GeoParams: AbstractMaterialParam, AbstractMaterialParamsStruct
import Base.show, GeoParams.param_info


abstract type AbstractSeismicVelocity{T} <: AbstractMaterialParam end

export  compute_pwave_velocity,  compute_swave_velocity,    # calculation routines
        compute_pwave_velocity!, compute_swave_velocity!,   # in place calculation
        ConstantSeismicVelocity,                         # constant
        melt_correction,
        anelastic_correction,
        param_info

include("../Utils.jl")
include("../Computations.jl") 

# Constant Velocity -------------------------------------------------------
"""
    ConstantSeismicVelocity(Vp=8.1 km/s, Vs=4.5km/s)
    
Set a constant seismic P and S-wave velocity:
```math  
    V_p = cst
```
```math  
    V_s = cst
```
where ``V_p, V_s`` are the P-wave and S-wave velocities [``km/s``].
"""
@with_kw_noshow struct ConstantSeismicVelocity{T,U} <: AbstractSeismicVelocity{T}   
    Vp::GeoUnit{T,U}             =  8.1km/s               # P-wave velocity
    Vs::GeoUnit{T,U}             =  4.5km/s               # S-wave velocity
end
ConstantSeismicVelocity(args...) = ConstantSeismicVelocity(convert.(GeoUnit,args)...)

function param_info(s::ConstantSeismicVelocity) # info about the struct
    return MaterialParamsInfo(Equation = L"v_p = cst \\ v_s = cst")
end

# Calculation routines
function compute_pwave_velocity(s::ConstantSeismicVelocity{_T}; kwargs...) where _T
    @unpack Vp   = s
    return Vp
end

compute_pwave_velocity(s::ConstantSeismicVelocity{_T}, kwargs) where _T = compute_pwave_velocity(s; kwargs...) 


#function (s::ConstantSeismicVelocity)(; kwargs...)
#function compute_pwave_velocity(s::ConstantSeismicVelocity; kwargs...)
#    @unpack Vs   = s
#    return Vs
#end

#compute_pwave_velocity(s::ConstantSeismicVelocity{_T}; kwargs...) where _T = s()
#compute_swave_velocity(s::ConstantSeismicVelocity{_T}; kwargs...) where _T = s()


# Calculation routine
function compute_pwave_velocity!(Vp_array::AbstractArray{_T}, s::ConstantSeismicVelocity{_T}; kwargs...) where _T
    for i in eachindex(Vp_array)
        @inbounds Vp_array[i] = compute_pwave_velocity(s; kwargs...)
    end
    return nothing
end

compute_pwave_velocity!(Vp_array::AbstractArray{_T}, s::ConstantSeismicVelocity{_T}, args) where _T = 
    compute_pwave_velocity!(Vp_array, s; args) 


function compute_swave_velocity!(Vs_array::AbstractArray{_T}, s::ConstantSeismicVelocity{_T}; kwargs...) where _T
    Threads.@threads for i in eachindex(Vs_array)
        @inbounds Vs_array[i] = s()
    end
    return nothing
end

# Print info 
function show(io::IO, g::ConstantSeismicVelocity)  
    print(io, "Constant seismic velocity: Vp=$(UnitValue(g.Vp)), Vs=$(UnitValue(g.Vs))")  
end
#-------------------------------------------------------------------------


#-------------------------------------------------------------------------
# Phase diagrams

#function param_info(s::PhaseDiagram_LookupTable) # info about the struct
#    return MaterialParamsInfo(Equation = L"Vp = f_{PhaseDiagram}(T,P))" )
#end

"""
    compute_pwave_velocity(s::PhaseDiagram_LookupTable, P,T)
Interpolates density as a function of `T,P` from a lookup table  
"""
function compute_pwave_velocity(s::PhaseDiagram_LookupTable; P, T, kwargs...)
    fn = s.Vp
    return fn(T,P)
end
compute_pwave_velocity(s::PhaseDiagram_LookupTable, args) = compute_pwave_velocity(s; args...)

"""
    compute_swave_velocity(s::PhaseDiagram_LookupTable, P,T)
Interpolates density as a function of `T,P` from a lookup table  
"""
function compute_swave_velocity(s::PhaseDiagram_LookupTable; P, T, kwargs...)
    fn = s.Vs
    return fn(T,P)
end
compute_swave_velocity(s::PhaseDiagram_LookupTable, args) = compute_swave_velocity(s; args...)


"""
    compute_pwave_velocity!(Vp::AbstractArray{<:AbstractFloat}, P::AbstractArray{<:AbstractFloat},T::AbstractArray{<:AbstractFloat}, s::PhaseDiagram_LookupTable)
In-place computation of p-wave velocity as a function of `T,P`, in case we are using a lookup table.    
"""
function compute_pwave_velocity!(Vp::AbstractArray{_T}, s::PhaseDiagram_LookupTable; P::AbstractArray{_T}=[zero(_T)],T::AbstractArray{_T}=[zero(_T)], kwargs...) where _T
    Vp[:] = s.Vp.(T,P)
    return nothing
end

"""
    compute_swave_velocity!(Vs::AbstractArray{<:AbstractFloat}, P::AbstractArray{<:AbstractFloat},T::AbstractArray{<:AbstractFloat}, s::PhaseDiagram_LookupTable)
In-place computation of s-wave velocity as a function of `T,P`, in case we are using a lookup table.    
"""
function compute_swave_velocity!(Vs::AbstractArray{_T}, s::PhaseDiagram_LookupTable; P::AbstractArray{_T}=[zero(_T)],T::AbstractArray{_T}=[zero(_T)], kwargs...) where _T
    Vs[:] = s.Vs.(T,P)
    return nothing
end

#compute_pwave_velocity!(Vp::AbstractArray, s::PhaseDiagram_LookupTable, args) = compute_pwave_velocity!(Vp, s, args...)
#compute_swave_velocity!(Vs::AbstractArray, s::PhaseDiagram_LookupTable, args) = compute_swave_velocity!(Vs, s, args...)

#-------------------------------------------------------------------------

#------------------------------------------------------------------------------------------------------------------#
# Computational routines needed for computations with the MaterialParams structure 

function compute_pwave_velocity(s::AbstractMaterialParamsStruct, args)
    if isempty(s.SeismicVelocity) #in case there is a phase with no melting parametrization
        return zero(typeof(args).types[1])
    else
        return compute_pwave_velocity(s.SeismicVelocity[1], args)
    end
end

function compute_swave_velocity(s::AbstractMaterialParamsStruct, args)
    if isempty(s.SeismicVelocity) #in case there is a phase with no melting parametrization
        return zero(typeof(args).types[1])
    else
        return compute_swave_velocity(s.SeismicVelocity[1], args)
    end
end

#-------------------------------------------------------------------------------------------------------------


function compute_pwave_velocity!(args...) 
   
    compute_param!(compute_pwave_velocity, args...) #Multiple dispatch to rest of routines found in Computations.jl
end

compute_pwave_velocity(args...)  = compute_param(compute_pwave_velocity, args...)
#compute_swave_velocity!(args...) = compute_param!(compute_swave_velocity, args...) #Multiple dispatch to rest of routines found in Computations.jl
#compute_swave_velocity(args...)  = compute_param(compute_swave_velocity, args...)

# for myType in (
#     :ConstantSeismicVelocity,
# )
#     @eval begin
#         #(p::$(myType))(args) = p(; args...)
#         compute_pwave_velocity(p::$(myType), args) = compute_pwave_velocity(p::$(myType); args...)
#         function compute_pwave_velocity!(Vp::AbstractArray, p::$(myType), args)
#             return compute_pwave_velocity!(Vp, p; args...)
#         end

#     end
# end


"""
        Vp_cor,Vs_cor = melt_correction(  Kb_L, Kb_S, Ks_S, ρL, ρS, Vp0, Vs0, ϕ, α)

Corrects P- and S-wave velocities if the rock is partially molten. 

Input:
====
- `Kb_L`: adiabatic bulk modulus of melt
- `Kb_S`: adiabatic bulk modulus of the solid phase
- `Ks_S`: shear modulus of the solid phase
- `ρL`  : density of the melt
- `ρS`  : density of the solid phase
- `Vp0` : initial P-wave velocitiy of the solid phase
- `Vs0` : initial S-wave velocitiy of the solid phase
- `ϕ`   : melt volume fraction
- `α`   : contiguity coefficient defining the geometry of the solid framework (contiguity)
          0.0 (layered melt distributed) < 0.1 (grain boundary melt) < 1.0 (melt in separated bubble pockets)

Output:
====
- `Vp_cor,Vs_cor` : corrected P-wave and S-wave velocities for melt fraction

The routine uses the reduction formulation of Clark & Lesher, (2017) and is based on the equilibrium geometry model for the solid skeleton of Takei et al., 1998.

References:
====

- Takei (1998) Constitutive mechanical relations of solid-liquid composites in terms of grain-boundary contiguity, Journal of Geophysical Research: Solid Earth, Vol(103)(B8), 18183--18203

- Clark & Lesher (2017) Elastic properties of silicate melts: Implications for low velocity zones at the lithosphere-asthenosphere boundary. Science Advances, Vol 3 (12), e1701312


"""
function melt_correction(   Kb_L::_T,
                            Kb_S::_T,
                            Ks_S::_T,
                            ρL::_T,
                            ρS::_T,
                            Vp0::_T,
                            Vs0::_T,
                            ϕ::_T,
                            α::_T) where _T<:Number

    # Takei 1998: Approximation Formulae for Bulk and Shear Moduli of Isotropic Solid Skeleton
    ν       = 0.25                         # poisson ratio

    aij = [ 0.318 6.780 57.560 0.182
            0.164 4.290 26.658 0.464
            1.549 4.814 8.777 -0.290   ]  #

    bij = [  -0.3238 0.2341
             -0.1819 0.5103  ]

    a = zeros(3);
    for i=1:3
        a[i] = aij[i,1]*exp(aij[i,2]*(ν-0.25) + aij[i,3]*(ν - 0.25)^3) + aij[i,4];
    end
    b = zeros(2);
    for i=1:2
        b[i] = bij[i,1]*ν + bij[i,2];
    end

    nk      = a[1]*α + a[2]*(1.0 - α) + a[3]*α*(1.0 - α)*(0.5 - α);
    nμ      = b[1]*α + b[2]*(1.0 - α);

    # computation of the bulk modulus ratio of the skeletal framework over the solid phase
    ksk_k   = α^(nk);
     # computation of the shear modulus ratio of the skeletal framework over the solid phase
    μsk_μ   = α^(nμ);

    # apply correction for the melt fraction to adiabatic bulk and shear modulii 
    ksk     = ksk_k*Kb_S;
    μsk     = μsk_μ*Ks_S;

    kb      = (1.0-ϕ)*ksk;
    μ       = (1.0-ϕ)*μsk;

    # ratio of skeleton adiabatic bulk modulus over solid phase bulk modulus
    ΛK      = Kb_S/kb;

    # ratio of skeleton shear modulus over solid phase shear modulus
    ΛG      = Ks_S/μ;

    # Seismic wave velocity melt correction Clark et al., 2017
    β       = Kb_S/Kb_L;
    γ       = Ks_S/Kb_S;

    # Formulation of the fraction reduction of P-wave and S-wave
    ΔVp     = (((((β -1.0)*ΛK) / ((β-1.0) + ΛK) + 4.0/3.0*γ*ΛG ) / ( 1.0 + 4.0/3.0*γ)) - (1.0 - ρL/ρS) )*(ϕ*0.5);
    ΔVs     = ( ΛG - (1.0 - ρL/ρS) )*(ϕ*0.5);

    # get the correction values
    Vp_cor  = Vp0 - ΔVp*Vp0;
    Vs_cor  = Vs0 - Vs0*ΔVs;

    return Vp_cor, Vs_cor
end


"""
        Vs_anel = anelastic_correction(water::Int64, Vs0::Float64,P::Float64,T::Float64)

This routine computes a correction of S-wave velocity for anelasticity

Input:
====
- `water`: water flag, 0 = dry; 1 = dampened; 2 = water saturated 
- `Vs0`  : S-wave velocitiy of the solid phase (with or without melt correction)
- `P`    : pressure given in kbar
- `T`    : temperature given in °C

Output:
====
- `Vs_anel` : corrected S-wave velocity for anelasticity

The routine uses the reduction formulation of Karato (1993), using the quality factor formulation from Behn et al. (2009)


References:
====

- Karato, S. I. (1993). Importance of anelasticity in the interpretation of seismic tomography. Geophysical research letters, 20(15), 1623-1626.

- Behn, M. D., Hirth, G., & Elsenbeck II, J. R. (2009). Implications of grain size evolution on the seismic structure of the oceanic upper mantle. Earth and Planetary Science Letters, 282(1-4), 178-189.


"""
function anelastic_correction(water::Int64, Vs0::Float64,P::Float64,T::Float64)

    kbar2pa= 100.0e3;
    c2K     = 273.0;

    Pref    = P*kbar2pa;            # pa
    Tref    = T+c2K;                # K

    R       = 8.31446261815324;     # gas constant
    # values based on fitting experimental constraints (Behn et al., 2009)
    α       = 0.27;
    B0      = 1.28e8;               # m/s
    dref    = 1.24e-5;              # m
    COHref  = 50.0/1e6;             # 50H/1e6Si

    Gref    = 1.09;
    Eref    = 505.0e3;              # J/mol
    Vref    = 1.2e-5;               # m3*mol

    G       = 1.00;
    E       = 420.0e3;              # J/mol (activation energy)
    V       = 1.2e-5;               # m3*mol (activation volume)

    # using remaining values from Cobden et al., 2018
    ω       = 0.01;                 # Hz (frequency to match for studied seismic system)
    d       = 1e-2;                 # m (grain size)
    
    if water == 0
        COH     = 50.0/1e6;         # for dry mantle
        r       = 0.0;              # for dry mantle
    elseif water == 1
        COH     = 1000.0/1e6;       # for damp mantle    
        r       = 1.0;              # for damp mantle
    elseif water == 2
        COH     = 3000.0/1e6;       # for wet mantle (saturated water)
        r       = 2.0;              # for wet mantle
    else
        print("water mode is not implemented. Valid values are 0 (dry),1 (dampened) and 2 (wet)")
    end

    B       = B0*dref^(G-Gref)*(COH/COHref)^r * exp( ((E+Pref*V)-(Eref + Pref*Vref))/(R*Tref) )

    Qinv    = (B*d^(-G)*ω^(-1.0) * exp(- (E+Pref*V)/(R*Tref)) )^α;

    Vs_anel = Vs0*(1.0 - (Qinv)/(2.0*tan(π*α/2.0) ) );


    return Vs_anel
end



end
