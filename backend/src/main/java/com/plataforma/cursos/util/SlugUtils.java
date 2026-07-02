package com.plataforma.cursos.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public final class SlugUtils {

    private static final Pattern CAMEL_CASE_BOUNDARY = Pattern.compile("(?<=[a-z0-9])(?=[A-Z])");
    private static final Pattern DIACRITICS = Pattern.compile("\\p{M}");
    private static final Pattern NON_ALPHANUMERIC = Pattern.compile("[^a-z0-9]+");
    private static final Pattern EDGE_DASHES = Pattern.compile("^-+|-+$");

    private SlugUtils() {
    }

    public static String slugify(String input) {
        String spaced = CAMEL_CASE_BOUNDARY.matcher(input).replaceAll(" ");
        String normalized = Normalizer.normalize(spaced, Normalizer.Form.NFD);
        String withoutDiacritics = DIACRITICS.matcher(normalized).replaceAll("");
        String lower = withoutDiacritics.toLowerCase();
        String dashed = NON_ALPHANUMERIC.matcher(lower).replaceAll("-");
        return EDGE_DASHES.matcher(dashed).replaceAll("");
    }
}
