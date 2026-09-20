import XCTest
@testable import MindReplyLocal

final class PolicyTests: XCTestCase {
    func testLocalOnlyDefaultsRemainLocked() {
        XCTAssertFalse(LocalInferencePolicy.remoteInferenceAllowed)
        XCTAssertFalse(LocalInferencePolicy.telemetryAllowed)
    }
}
