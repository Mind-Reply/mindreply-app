import CoreML
import Foundation

/// Local-only Core ML execution boundary.
///
/// The library intentionally contains no networking client, analytics SDK, or
/// remote fallback. Applications must make any future network capability an
/// explicit, separately reviewed dependency.
public actor LocalInferenceEngine {
    private let model: MLModel

    public init(
        compiledModelURL: URL,
        computeUnits: MLComputeUnits = .all
    ) throws {
        let configuration = MLModelConfiguration()
        configuration.computeUnits = computeUnits
        self.model = try MLModel(
            contentsOf: compiledModelURL,
            configuration: configuration
        )
    }

    public func prediction(
        from input: MLFeatureProvider
    ) throws -> MLFeatureProvider {
        try model.prediction(from: input)
    }
}

public enum LocalInferencePolicy {
    /// Secure default: no cloud inference and no telemetry.
    public static let remoteInferenceAllowed = false
    public static let telemetryAllowed = false
}
