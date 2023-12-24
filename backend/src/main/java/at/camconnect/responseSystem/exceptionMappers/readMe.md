## Exception mappers

Basically quarkus provides interfaces that can be implemented to customize the automated quarkus exceptions.
This way, things like parsing jsonData from the POST body to a DTO does not throw a meaningless 400 and a weird error.
Instead, it creates a proper ccException that can be understood by API callers or the frontend.