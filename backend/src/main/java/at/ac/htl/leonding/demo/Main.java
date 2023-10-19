package at.ac.htl.leonding.demo;

import org.jboss.logging.Logger;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.annotations.QuarkusMain;

@QuarkusMain
public class Main {
    private static final Logger LOG = Logger.getLogger(Main.class);
    public static void main(String ...args) {
        LOG.info("starting main...");
        Quarkus.run(args);
    }
}
