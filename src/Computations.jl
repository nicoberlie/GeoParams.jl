using GeoParams: AbstractMaterialParam, AbstractMaterialParamsStruct
using ..Units
using Parameters, Unitful


# Computational routines needed for computations with the MaterialParams structure 

# with tuple & vector - apply for all phases in MatParam
function compute_param!(fn::F, rho::Vector{_T}, MatParam::NTuple{N,AbstractMaterialParamsStruct}, P::_T=zero(_T),T::_T=zero(_T)) where {F,N,_T}
    rho .= map(x->fn(x,P,T), MatParam)
end

# each individual calcuation 
function compute_param(fn::F, MatParam::NTuple{N,AbstractMaterialParamsStruct}, P::_T=zero(_T),T::_T=zero(_T)) where {F,N,_T}
    map(x->fn(x,P,T), MatParam)
end

#---------------------------------------------------------------------------------------------------------------------------#
#Computational routines for Phases


function compute_param!(fn::F, rho::AbstractArray{_T, ndim}, MatParam::NTuple{N,AbstractMaterialParamsStruct}, Phases::AbstractArray{_I, ndim}, P=nothing, T=nothing) where {F,ndim,N,_T,_I<:Integer}
    Phase_tup = ntuple(i->MatParam[i].Phase, Val(N))
    
    # check if we compute with P/T or use default values    
    isnothing(T) ? compute_T = false : compute_T = true
    isnothing(P) ? compute_P = false : compute_P = true
    
    Tval = zero(_T)
    Pval = zero(_T)

    @inbounds for I in eachindex(Phases)
        phase   = find_ind(Phase_tup, Phases[I])

        # Extract relevant value if requested 
        if compute_T; Tval = T[I]; end
        if compute_P; Pval = P[I]; end
       
        # this computes density for ALL phases, which is a bit of an overkill as we only need density for a single phase
        rho_tup = fn(MatParam, Pval, Tval)    
        rho[I]  = rho_tup[phase]
    end
    #map!((Phases,P,T)->compute_density(MatParam,P,T)[find_ind(Phase_tup,Phases)],rho,Phases,P,T)
end


#Phase PhaseRatios

function compute_param!(fn::F, rho::AbstractArray{_T, N}, MatParam::NTuple{K,AbstractMaterialParamsStruct}, PhaseRatios::AbstractArray{_T, M}, P=nothing, T=nothing) where {F,_T<:AbstractFloat, N,M, K}
    if M!=(N+1)
        error("The PhaseRatios array should have one dimension more than the other arrays")
    end

    # check if we compute with P/T or use default values    
    isnothing(T) ? compute_T = false : compute_T = true
    isnothing(P) ? compute_P = false : compute_P = true

    Tval = zero(_T)
    Pval = zero(_T)
    if compute_P
        Rindex = CartesianIndices(P)
    else
        Rindex = CartesianIndices(T)
    end     
   
    @inbounds for I in Rindex
        frac    = view(PhaseRatios, Tuple(I)..., 1:K)    # fraction of each phase @ point I 
        
        # Extract relevant value if requested 
        if compute_T; Tval = T[I]; end
        if compute_P; Pval = P[I]; end

        # compute point-wise density:
        rho[I] = compute_param_times_frac(fn, frac, MatParam, Pval, Tval) 
    end

    return 
end

#Multiplies parameter with the fraction of a phase
function compute_param_times_frac(fn::F, PhaseRatios::AbstractArray{_T, 1}, MatParam::NTuple{N,AbstractMaterialParamsStruct}, P::_T, T::_T) where {F,_T, N}

    value_tup = fn(MatParam, P, T)
    
    # Sum & multiply density with fraction
    val = zero(_T)
    @inbounds for j=1:N             
        val += PhaseRatios[j]*value_tup[j]
    end

    return val 
end



