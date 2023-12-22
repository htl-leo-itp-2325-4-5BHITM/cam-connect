package at.camconnect;

import java.util.List;

public class Utils {
    public static String getTypeOfObjectAsString(Object obj) {
        if (obj == null) {
            return "null";
        } else if (obj.getClass().isArray()) {
            // If it's an array
            return "[" + obj.getClass().getComponentType().getName() + "]";
        } else if (obj instanceof List<?> list) {
            // If it's a List
            if (list.isEmpty()) {
                return "List<empty>";
            } else {
                String className = list.get(0).getClass().getName();
                String[] parts = className.split("\\.");
                className = className.replace("." + parts[parts.length-1], "");
                return "[" + className + "]";
            }
        } else {
            // For other types
            return obj.getClass().getName();
        }
    }
}
