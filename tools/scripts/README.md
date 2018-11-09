# scripts

## release.sh

This is a script for releasing the nf-grapher artifacts. This is currently a manual process.
To upload, you must have permission to publish npm, maven, and pypi artifacts.

You can preview a build running the following command from the top level nf-grapher directory,

```bash
sh tools/scripts/release.sh --dry-run
```

This will update version numbers in the appropriate places, for instance, `js/package.json` and
`java/pom.xml`. This will **not** upload the created artifacts Maven Central Repository.

Use the command without `--dry-run` to perform the build and upload.

```bash
sh tools/scripts/release.sh
```

You should **never** commit any resulting local changes to master as a result of releasing. We want
the nf-grapher libraries to version together so they will always have their version number set
prior to release.

