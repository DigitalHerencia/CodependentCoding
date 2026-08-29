# Layer contract

Every layer has a narrow input, stable output, and explicit side-effect budget. Values crossing client or HTTP boundaries are serializable. Mappers have no I/O; fetchers do not write; provider adapters do not authorize; transaction helpers do not perform network calls.
