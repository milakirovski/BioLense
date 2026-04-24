package mk.ukim.finki.uikt.biolense.backendbiolense.helpers;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public final class ImageHashUtil {

    private ImageHashUtil() {}

    /**
     * Computes the SHA-256 hex digest of the given bytes.
     * Used to fingerprint image uploads without storing the raw bytes.
     */
    public static String sha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data);
            StringBuilder hex = new StringBuilder(hash.length * 2);
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            // SHA-256 is always available in the JVM
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }

    /**
     * Builds the cache lookup key from its constituent parts.
     * The key is itself SHA-256 hashed so that it fits in a fixed 64-char column
     * regardless of how large the latitude/longitude strings grow.
     *
     * Format before hashing: "requestType|imageHash|lat|lon"
     * Null latitude or longitude is represented as the literal string "null".
     */
    public static String buildCacheKey(String requestType, String imageHash,
                                       Double latitude, Double longitude) {
        String raw = requestType + "|" + imageHash
                + "|" + (latitude != null ? latitude : "null")
                + "|" + (longitude != null ? longitude : "null");
        return sha256(raw.getBytes());
    }
}
