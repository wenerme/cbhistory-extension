# project
PROJECT_NAME=$(notdir $(CURDIR))
RELEASE_DIR=$(notdir $(CURDIR)).rel
# release
JS=js/*
IMAGES=images/*.png
CSS=css/*.css
LESS=css/*.less
TRIM_FILE=*.html *.json
EXTRA_FILES= LICENSE

FOLDER=_locales css images js
FILES=_locales $(TRIM_FILE) $(JS) $(IMAGES) $(EXTRA_FILES)

# SEXT
SEXT_CSS_TRIM=css/pagestyle.css
SEXT_ADD_FILE=*.xml *.png *.ico
SEXT_DELETE_FILE=*.json

# 编译选项
GC_FLAG=--charset utf-8 -D DEBUG="false" # --compilation_level ADVANCED_OPTIMIZATIONS
LESSC_FLAG=-x --yui-compress

# for release version
love: cbhistory

cbhistory: clean copyfiles


prepare:
	# merge js file
	cd js; $(MAKE) $(MFLAGS)

release: prepare clean copyfiles compile
	# trim html file
	cd $(RELEASE_DIR);stripthisline $(TRIM_FILE)

copyfiles:
	# Create target dir
	-mkdir $(RELEASE_DIR)
	# Copy files
	-cp --parents -rt $(RELEASE_DIR) $(FILES)

compile: compileless

compilejs:
	echo -e "\e[01;31m Compile js FLAG: \e[01;34m$(GC_FLAG)\e[00m"
	-cd $(RELEASE_DIR) ;\
	for fn in `ls $(JS)`; \
	do \
		echo -e "\e[00;32m compile $$fn \e[00m";\
		gc $(GC_FLAG) --js $$fn --js_output_file tmp.js; \
		cp -f tmp.js $$fn ;\
	done;\
	rm tmp.js;
	echo -e "\e[01;31m Compile js done\e[00m"

compileless:
	echo -e "\e[01;31m Compile less FLAG: \e[01;34m$(LESSC_FLAG)\e[00m"
	-cd $(RELEASE_DIR) ;\
	for fn in `ls $(LESS)`; \
	do \
		cssfn=`dirname $$fn`/`basename $$fn .less`.css ;\
		echo -e "\e[00;32m compile $$fn to $$cssfn \e[00m";\
		lessc $(LESSC_FLAG) $$fn $$cssfn;\
	done;\
	rm -f $(LESS)
	echo -e "\e[01;31m Compile less done\e[00m"

clean:
	# DELETE TEMP FOLDER
	-rm -r \
		$(PROJECT_NAME).rel.zip	\
		$(PROJECT_NAME).src.zip	\
		$(PROJECT_NAME).rel		\
		rel


.PHONY: clean love release test
